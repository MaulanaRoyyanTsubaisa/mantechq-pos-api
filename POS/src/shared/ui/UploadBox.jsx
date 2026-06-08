import React, { useEffect, useState } from 'react'
import { Upload } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '../lib/cn.js'

export function UploadBox() {
  const [fileInfo, setFileInfo] = useState(null)
  const [preview, setPreview] = useState('')

  useEffect(() => {
    if (!fileInfo?.file || !fileInfo.file.type.startsWith('image/')) {
      setPreview('')
      return undefined
    }
    const nextPreview = URL.createObjectURL(fileInfo.file)
    setPreview(nextPreview)
    return () => URL.revokeObjectURL(nextPreview)
  }, [fileInfo])

  const handleFile = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    setFileInfo({ file, name: file.name })
    toast.success(`Foto dipilih: ${file.name}`)
  }

  return (
    <label className={cn('upload-box', fileInfo && 'has-file')}>
      <input type="file" accept="image/png,image/jpeg,image/jpg" onChange={handleFile} />
      {preview ? <img src={preview} alt="Preview foto karyawan" /> : <Upload size={18} />}
      <span>{fileInfo?.name || 'Pilih atau letakkan berkas di sini'}</span>
    </label>
  )
}
