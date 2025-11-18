# Cloudinary Otomatik Temizleme Rehberi

Avatar sisteminde kullanılmayan resimlerin Cloudinary'den silinmesi için çeşitli yöntemler.

## 🎯 Sorun

Kullanıcı avatar değiştirdiğinde veya kaldırdığında:
- ✅ Supabase'den referans siliniyor
- ❌ Cloudinary'de eski resim kalıyor (depolama kullanıyor)

## 💡 Çözüm Seçenekleri

### Seçenek 1: Manuel Temizleme (Şu an aktif)

**Artıları:**
- Basit, ek kod gerektirmiyor
- Güvenli

**Eksileri:**
- Manuel işlem gerekiyor
- Depolama zamanla dolabilir

**Nasıl Yapılır:**
1. [Cloudinary Console](https://cloudinary.com/console/media_library) → Media Library
2. `markdown-previewer/avatars` klasörünü aç
3. Kullanılmayan resimleri seç ve sil

---

### Seçenek 2: Cloudinary Auto-Upload Mapping (Önerilen ✨)

Cloudinary'nin otomatik temizleme özelliğini kullan.

#### Upload Preset Ayarları:

1. **Settings** → **Upload** → Upload preset'i düzenle
2. **Access Control** bölümünde:
   - **Access mode**: `public` (varsayılan)
3. **Eager transformations** bölümünde:
   - **Invalidate**: `true` (eski versiyonları geçersiz kılar)

#### Auto-tagging Ekle:

Upload preset'e tag ekle:
```
tags: user_avatar, temp
```

#### Lifecycle Policy (Media Library):

1. Media Library → Klasör ayarları
2. **Auto-moderation** kur:
   - 30 gün sonra "temp" tag'li resimleri otomatik sil
   - Veya belirli tarihten sonra sil

---

### Seçenek 3: Supabase Edge Function (En Güvenli 🔒)

Backend'den Cloudinary Admin API ile silme.

#### 1. Cloudinary API Credentials

`.env` dosyasına ekle:
```env
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Not:** Bu bilgiler **ASLA** frontend'e gönderilmemeli!

#### 2. Supabase Edge Function Oluştur

```bash
# Supabase CLI ile
supabase functions new delete-avatar
```

#### 3. Edge Function Kodu

`supabase/functions/delete-avatar/index.ts`:

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CLOUDINARY_CLOUD_NAME = Deno.env.get('CLOUDINARY_CLOUD_NAME')
const CLOUDINARY_API_KEY = Deno.env.get('CLOUDINARY_API_KEY')
const CLOUDINARY_API_SECRET = Deno.env.get('CLOUDINARY_API_SECRET')

serve(async (req) => {
  try {
    // Auth check
    const authHeader = req.headers.get('Authorization')!
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      return new Response('Unauthorized', { status: 401 })
    }

    // Get public_id from request
    const { publicId } = await req.json()

    if (!publicId) {
      return new Response('Missing publicId', { status: 400 })
    }

    // Delete from Cloudinary
    const timestamp = Math.floor(Date.now() / 1000)
    const signature = await generateSignature(publicId, timestamp)

    const formData = new FormData()
    formData.append('public_id', publicId)
    formData.append('signature', signature)
    formData.append('api_key', CLOUDINARY_API_KEY!)
    formData.append('timestamp', timestamp.toString())

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/destroy`,
      {
        method: 'POST',
        body: formData,
      }
    )

    const result = await response.json()

    return new Response(
      JSON.stringify({ success: true, result }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})

async function generateSignature(publicId: string, timestamp: number) {
  const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`

  const encoder = new TextEncoder()
  const data = encoder.encode(stringToSign)
  const hashBuffer = await crypto.subtle.digest('SHA-1', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

  return hashHex
}
```

#### 4. Deploy Edge Function

```bash
supabase functions deploy delete-avatar --no-verify-jwt
```

#### 5. Frontend'den Çağırma

`AccountSettings.jsx` içinde TODO kısmını güncelle:

```javascript
if (publicId) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-avatar`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ publicId })
      }
    )

    if (!response.ok) {
      console.error('Cloudinary deletion failed')
    }
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error)
  }
}
```

---

### Seçenek 4: Cloudinary Upload Widget Restriction

Her kullanıcının sadece 1 avatar'ı olmasını sağla.

#### Upload Preset'e Overwrite Ekle:

```javascript
// AccountSettings.jsx - Cloudinary widget config
{
  cloudName: '...',
  uploadPreset: '...',
  publicId: `user_${user.id}_avatar`, // Sabit public_id
  overwrite: true, // Eski resmi üzerine yaz
  invalidate: true, // CDN cache'i temizle
  ...
}
```

Bu şekilde her kullanıcının tek bir avatar'ı olur ve yeni yükleme eskisinin üzerine yazar.

---

## 🎖️ Önerilen Yaklaşım

Projeni production'a çıkaracaksan:

1. **Şimdilik:** Manuel temizleme (Seçenek 1)
2. **Kısa vadede:** Overwrite ile tek avatar (Seçenek 4) - **EN KOLAY**
3. **Uzun vadede:** Edge Function (Seçenek 3) - **EN GÜVENLİ**

## 🚀 Hızlı Uygulama: Overwrite Yöntemi

En basit çözüm, her kullanıcının sabit bir `public_id` kullanması:

`AccountSettings.jsx` içinde widget config'i güncelle:

```javascript
const widget = window.cloudinary.createUploadWidget(
  {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo',
    uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ml_default',
    sources: ['local', 'url', 'camera'],
    multiple: false,
    maxFiles: 1,
    maxFileSize: 5000000,
    clientAllowedFormats: ['png', 'jpg', 'jpeg', 'gif', 'webp'],
    cropping: true,
    croppingAspectRatio: 1,

    // 🔥 YENİ: Sabit public_id ve overwrite
    publicId: `user_${user.id}_avatar`,
    overwrite: true,
    invalidate: true,

    folder: 'markdown-previewer/avatars',
    tags: ['avatar', 'profile'],
  },
  // ... callback
);
```

Bu şekilde:
- ✅ Her kullanıcının **tek** bir avatar'ı olur
- ✅ Yeni yükleme **eskisinin üzerine yazar**
- ✅ Depolama limiti **sabit** kalır
- ✅ Ek backend kodu **gerektirmez**

---

## 📊 Cloudinary Limitleri

Free tier:
- 25 GB depolama
- 1,000 transformation/ay

**Örnek hesaplama:**
- Avatar başına: ~200 KB
- 25 GB / 200 KB = **~125,000 avatar**
- Overwrite ile: Kullanıcı sayısı kadar avatar (örn: 10,000 kullanıcı = 2 GB)

---

## 🛠️ Sorun Giderme

### Resimler silinmiyor
- Preset'te `overwrite: true` var mı kontrol et
- `publicId` parametresi doğru mu kontrol et
- Cloudinary Console'da manuel sil ve tekrar dene

### "Unauthorized" hatası (Edge Function)
- API credentials doğru mu kontrol et
- Edge Function deploy edildi mi kontrol et
- Authorization header gönderiliyor mu kontrol et

---

## 📚 Daha Fazla Bilgi

- [Cloudinary Admin API](https://cloudinary.com/documentation/admin_api)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Upload Widget Options](https://cloudinary.com/documentation/upload_widget_reference)
