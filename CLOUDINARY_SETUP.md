# Cloudinary Kurulumu

Avatar yükleme özelliğini kullanmak için Cloudinary hesabı oluşturmanız gerekiyor.

## 1. Cloudinary Hesabı Oluşturma

1. [Cloudinary Console](https://cloudinary.com/console)'a gidin
2. Ücretsiz hesap oluşturun (email ile veya Google/GitHub ile)
3. Dashboard'unuzu açın

## 2. Cloud Name Bulma

1. Dashboard'da üstte **Cloud name** görünecektir
2. Bu değeri kopyalayın
3. `.env` dosyanıza ekleyin:
   ```
   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
   ```

## 3. Upload Preset Oluşturma

Upload preset, güvenli bir şekilde resim yüklemenizi sağlar.

### Adımlar:

1. Cloudinary Console'da **Settings** (⚙️) butonuna tıklayın
2. **Upload** sekmesine gidin
3. Sayfayı aşağı kaydırın, **Upload presets** bölümünü bulun
4. **Add upload preset** butonuna tıklayın

### Ayarlar:

- **Preset name**: `markdown_previewer_avatars` (veya istediğiniz bir isim)
- **Signing mode**: **Unsigned** seçin (önemli!)
- **Folder**: `markdown-previewer/avatars` (otomatik klasörleme)
- **Allowed formats**: `jpg,jpeg,png,gif,webp`
- **Transformation**:
  - Mode: **Limit**
  - Width: `400`
  - Height: `400`
  - Quality: `auto:good`
- **Access control**: Public (default)

5. **Save** butonuna tıklayın

## 4. .env Dosyasını Güncelleme

Preset adını `.env` dosyanıza ekleyin:

```env
VITE_CLOUDINARY_UPLOAD_PRESET=markdown_previewer_avatars
```

## 5. Test Etme

1. Uygulamayı yeniden başlatın: `npm run dev`
2. Giriş yapın
3. Account Settings'i açın
4. "Resim Yükle" butonuna tıklayın
5. Resim seçin ve yükleyin

## Güvenlik Notları

- **Unsigned preset** kullanıyoruz, bu frontend'den güvenli yükleme sağlar
- Preset ayarlarında dosya boyutu, format ve boyut sınırlamaları koyabilirsiniz
- Cloudinary otomatik olarak resimleri optimize eder
- Folder yapısı ile avatarlar organize tutulur

## Ücretsiz Limitler

Cloudinary free tier:
- 25 GB depolama
- 25 GB bandwidth/ay
- 1,000 transformation/ay

Bu limitler bu proje için yeterlidir!

## Alternatif: Demo Credentials

Test için Cloudinary'nin demo hesabını da kullanabilirsiniz:

```env
VITE_CLOUDINARY_CLOUD_NAME=demo
VITE_CLOUDINARY_UPLOAD_PRESET=ml_default
```

**Not**: Demo hesap production için uygun değildir, sadece test içindir.

## Sorun Giderme

### "Widget yüklenemedi" hatası
- Cloudinary script yükleniyor mu kontrol edin (Network sekmesi)
- Environment variables doğru mu kontrol edin
- Tarayıcı console'da hata mesajları var mı bakın

### "Upload preset not found" hatası
- Preset adının doğru olduğundan emin olun
- Preset'in **Unsigned** olduğundan emin olun
- Cloudinary Console'da preset'in aktif olduğunu kontrol edin

### Resim yüklenmiyor
- Dosya formatı destekleniyor mu kontrol edin
- Dosya boyutu 5MB'dan küçük mü kontrol edin
- Network sekmesinde upload isteğini kontrol edin

## Daha Fazla Bilgi

- [Cloudinary Upload Widget Docs](https://cloudinary.com/documentation/upload_widget)
- [Upload Presets](https://cloudinary.com/documentation/upload_presets)
- [Image Transformations](https://cloudinary.com/documentation/image_transformations)
