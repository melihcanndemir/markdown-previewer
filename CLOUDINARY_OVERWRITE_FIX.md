# Cloudinary Overwrite Sorunu Çözümü

## ❌ Sorun

Unsigned upload preset'te `overwrite` parametresi frontend'den gönderilemez:

```
Overwrite parameter is not allowed when using unsigned upload
```

## ✅ Çözüm: Upload Preset'te Overwrite Aktif Et

### 1. Cloudinary Console'a Git

[https://cloudinary.com/console](https://cloudinary.com/console)

### 2. Settings → Upload

1. **Settings** (⚙️) tıkla
2. **Upload** sekmesine git
3. **Upload presets** bölümünü bul
4. `markdown_previewer_avatars` preset'ini bul
5. **Edit** (Düzenle) butonuna tıkla

### 3. Overwrite Ayarını Aktif Et

**Upload Manipulations** bölümünde:

```
☑️ Overwrite
   ☑️ Use filename as Public ID
   ☑️ Unique filename: false
   ☑️ Invalidate: true
```

**Veya Advanced Settings'de:**

```json
{
  "overwrite": true,
  "unique_filename": false,
  "use_filename": false,
  "invalidate": true
}
```

### 4. Public ID Prefix (Opsiyonel)

Eğer her kullanıcı için ayrı prefix istiyorsan:

```
Public ID Prefix: user_{user_id}_
```

**ANCAK** bu dinamik değer frontend'den geldiği için çalışmaz.
Bunun yerine preset'te sabit prefix kullan veya hiç kullanma.

### 5. Save

**Save** butonuna tıkla.

## 🧪 Test Et

```bash
# Dev server'ı yeniden başlat
npm run dev
```

1. Account Settings aç
2. Avatar yükle
3. Başka bir avatar yükle
4. ✅ Cloudinary Media Library'de aynı dosyanın üzerine yazıldığını göreceksin

## 📊 Sonuç

Her kullanıcı için:
- İlk yükleme: `user_abc123_avatar.jpg` oluşturulur
- İkinci yükleme: `user_abc123_avatar.jpg` **üzerine yazılır** (overwrite)
- Üçüncü yükleme: `user_abc123_avatar.jpg` **üzerine yazılır**
- ...

Sonuç: Kullanıcı başına **sadece 1 dosya** Cloudinary'de kalır!

## 🔧 Alternatif: Signed Upload

Eğer preset ayarlarını değiştirmek istemiyorsan, **signed upload** kullanabilirsin (backend gerekir):

### Backend Endpoint Gerekir:

```javascript
// Backend'de (Node.js/Supabase Edge Function)
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

app.post('/api/upload-signature', (req, res) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request({
    timestamp: timestamp,
    upload_preset: 'markdown_previewer_avatars',
    public_id: req.body.public_id,
    overwrite: true,
    invalidate: true
  }, process.env.CLOUDINARY_API_SECRET);

  res.json({ signature, timestamp });
});
```

### Frontend'den Kullan:

```javascript
// Signature backend'den al
const { signature, timestamp } = await fetch('/api/upload-signature', {
  method: 'POST',
  body: JSON.stringify({ public_id: `user_${user.id}_avatar` })
}).then(r => r.json());

// Widget'a ekle
const widget = window.cloudinary.createUploadWidget({
  cloudName: '...',
  uploadPreset: '...',
  apiKey: '...',
  uploadSignature: signature,
  uploadSignatureTimestamp: timestamp,
  publicId: `user_${user.id}_avatar`,
  overwrite: true, // Şimdi çalışır!
  invalidate: true
});
```

## 📝 Önerilen Yaklaşım

**Şimdilik:** Preset ayarlarında `overwrite: true` aktif et (EN KOLAY)

**İleride:** Signed upload ile backend endpoint (EN GÜVENLİ)

## 🔗 Kaynaklar

- [Upload Presets](https://cloudinary.com/documentation/upload_presets)
- [Signed Uploads](https://cloudinary.com/documentation/upload_images#generating_authentication_signatures)
- [Upload Widget Reference](https://cloudinary.com/documentation/upload_widget_reference)
