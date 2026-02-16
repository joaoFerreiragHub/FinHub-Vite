# 📤 Fase API 6: Upload de Ficheiros - COMPLETA

**Data**: 2026-02-15
**Status**: ✅ **COMPLETA**
**Objetivo**: Sistema completo de upload de ficheiros (imagens, vídeos, áudio, documentos)

---

## 📋 Sumário

Implementação completa do sistema de **upload de ficheiros** para a plataforma FinHub com suporte para:

- ✅ **4 tipos de ficheiros**: Imagens, Vídeos, Áudio, Documentos
- ✅ **Validação automática**: Tipo, tamanho, extensão
- ✅ **Storage local**: Com organização por tipo
- ✅ **Multer configurado**: Middleware robusto
- ✅ **Admin tools**: Listagem, estatísticas, limpeza

---

## 📁 Estrutura de Ficheiros

```
API_finhub/
├── src/
│   ├── config/
│   │   └── upload.config.ts        ← ✨ NOVO (Multer config)
│   │
│   ├── services/
│   │   └── upload.service.ts       ← ✨ NOVO (Upload logic)
│   │
│   ├── controllers/
│   │   └── upload.controller.ts    ← ✨ NOVO (Handlers)
│   │
│   └── routes/
│       ├── upload.routes.ts        ← ✨ NOVO (Endpoints)
│       └── index.ts                ← Atualizado
│
└── uploads/                         ← ✨ NOVO (Storage)
    ├── image/
    ├── video/
    ├── audio/
    └── document/
```

**Total**: 4 novos ficheiros + diretórios de storage

---

## 🔧 Configuração: upload.config.ts

### Limites por Tipo

| Tipo | Tamanho Máx | Mimetypes | Extensões |
|------|-------------|-----------|-----------|
| **Image** | 5 MB | image/jpeg, image/png, image/gif, image/webp | .jpg, .jpeg, .png, .gif, .webp |
| **Video** | 100 MB | video/mp4, video/webm, video/ogg | .mp4, .webm, .ogg |
| **Audio** | 20 MB | audio/mpeg, audio/mp3, audio/wav, audio/ogg | .mp3, .wav, .ogg |
| **Document** | 10 MB | application/pdf, application/msword, .docx | .pdf, .doc, .docx |

### Storage Strategy

- **Local storage** em `/uploads/{type}/`
- **Nome único**: `timestamp-random-nome-sanitizado.ext`
- **URL pública**: `/uploads/{type}/{filename}`
- **Organização automática** por tipo

---

## 🌐 Endpoints

Total: **7 endpoints** (4 upload + 3 admin)

### Upload (Auth Required)

```http
# Upload de imagem
POST /api/upload/image
Content-Type: multipart/form-data
Authorization: Bearer {token}
Body: file (campo 'file')

# Upload de vídeo
POST /api/upload/video

# Upload de áudio
POST /api/upload/audio

# Upload de documento
POST /api/upload/document
```

### Gestão (Auth Required)

```http
# Eliminar ficheiro
DELETE /api/upload
Body: { "url": "/uploads/image/123-foto.jpg" }
```

### Admin Only

```http
# Listar ficheiros por tipo
GET /api/upload/list/:type
Params: type = image|video|audio|document

# Estatísticas de uploads
GET /api/upload/stats
```

---

## 📝 Como Usar

### 1. Upload de Imagem (Frontend)

```javascript
const formData = new FormData()
formData.append('file', imageFile)

const response = await fetch('/api/upload/image', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
})

const result = await response.json()
/*
{
  "filename": "1739632145123-minha-foto.jpg",
  "originalName": "minha-foto.jpg",
  "mimetype": "image/jpeg",
  "size": 245678,
  "uploadType": "image",
  "url": "/uploads/image/1739632145123-minha-foto.jpg",
  "path": "/path/to/uploads/image/1739632145123-minha-foto.jpg"
}
*/
```

### 2. Usar URL no Conteúdo

```javascript
// Ao criar artigo, por exemplo
POST /api/articles
{
  "title": "Meu Artigo",
  "coverImage": "/uploads/image/1739632145123-minha-foto.jpg",
  ...
}
```

### 3. Eliminar Ficheiro

```javascript
DELETE /api/upload
{
  "url": "/uploads/image/1739632145123-minha-foto.jpg"
}
```

### 4. Admin: Ver Estatísticas

```http
GET /api/upload/stats
Authorization: Bearer {admin_token}

Response:
{
  "byType": {
    "image": {
      "count": 234,
      "totalSize": 52428800,
      "totalSizeMB": "50.00"
    },
    "video": {
      "count": 45,
      "totalSize": 2147483648,
      "totalSizeMB": "2048.00"
    },
    ...
  },
  "total": 315,
  "totalSize": 3221225472,
  "totalSizeMB": "3072.00",
  "totalSizeGB": "3.00"
}
```

---

## ✅ Features Implementadas

### Upload Service

- ✅ `processUpload()` - Processar ficheiro uploaded
- ✅ `deleteFile()` - Eliminar por path absoluto
- ✅ `deleteFileByUrl()` - Eliminar por URL relativo
- ✅ `getFileInfo()` - Obter informação de ficheiro
- ✅ `listFiles()` - Listar por tipo
- ✅ `getTotalSize()` - Calcular tamanho total
- ✅ `cleanOldFiles()` - Limpar ficheiros antigos (manutenção)

### Upload Controller

- ✅ `uploadImage()` - Handler para imagens
- ✅ `uploadVideo()` - Handler para vídeos
- ✅ `uploadAudio()` - Handler para áudio
- ✅ `uploadDocument()` - Handler para documentos
- ✅ `deleteFile()` - Handler para eliminar
- ✅ `listFiles()` - Handler para listar (admin)
- ✅ `getUploadStats()` - Handler para stats (admin)

### Validações

- ✅ Mimetype validation
- ✅ Extension validation
- ✅ File size limits
- ✅ Authentication required
- ✅ Admin-only para listagem/stats

---

## 🚀 Próximos Passos (Opcional)

### Integração com Cloud Storage

Para produção, considera integrar com:
- **AWS S3** - Armazenamento escalável
- **Cloudinary** - Otimização automática de imagens
- **Azure Blob Storage** - Alternativa Microsoft

### Image Processing

- **Sharp** - Resize, crop, thumbnails
- **Compressão automática** - Reduzir tamanho
- **Multiple sizes** - Thumbnail, medium, large

### Video Processing

- **FFmpeg** - Conversão, thumbnails, compressão
- **Streaming** - HLS/DASH para grandes ficheiros

---

## 📊 Estatísticas Finais

### Fase 6 Criada
- **Ficheiros novos**: 4 (config, service, controller, routes)
- **Endpoints**: 7 (4 upload + 1 delete + 2 admin)
- **Tipos suportados**: 4 (image, video, audio, document)
- **Linhas de código**: ~650 linhas

---

**Status Final**: ✅ **FASE 6 COMPLETA**
**Upload System**: Funcional e pronto para uso
**Storage**: Local (ready para cloud integration)
**Próximo**: Fase 7 (Social Features)
