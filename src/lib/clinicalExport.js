function stripHtml(html) {
  return (html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function noteToPlainBlock(note, profileName) {
  const date = note.session_date || note.created_at?.split('T')[0] || ''
  const modality = note.modality_used ? `\nModality: ${note.modality_used}` : ''
  const theme = note.therapeutic_theme ? `\nTheme: ${note.therapeutic_theme}` : ''
  const attachments = note.artwork_attachments?.length
    ? `\nArtwork attachments: ${note.artwork_attachments.map(a => a.name).join(', ')}`
    : ''
  return `${note.title}\nDate: ${date}\nAuthor: ${profileName || 'Clinician'}${modality}${theme}${attachments}\n\n${stripHtml(note.content)}`
}

function downloadBlob(filename, blob) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

/** Mock batch export — resolves after delay with a browser download. */
export function exportClinicalNotes(notes, { format, clientName, getAuthorName }) {
  const safeName = (clientName || 'client').replace(/\s+/g, '-').toLowerCase()
  const timestamp = new Date().toISOString().split('T')[0]

  return new Promise((resolve) => {
    setTimeout(() => {
      if (format === 'combined-pdf') {
        const body = notes.map(n => noteToPlainBlock(n, getAuthorName?.(n.author_id))).join('\n\n---\n\n')
        const header = `ChromatiK Clinical Record — ${clientName || 'Client'}\nExported: ${timestamp}\nNotes: ${notes.length}\n\n`
        downloadBlob(
          `${safeName}-clinical-record-${timestamp}.pdf`,
          new Blob([header + body], { type: 'application/pdf' }),
        )
      } else {
        const manifest = notes.map((n, i) => {
          const block = noteToPlainBlock(n, getAuthorName?.(n.author_id))
          return `=== FILE ${i + 1}: ${n.title.replace(/[^\w\s-]/g, '')}.txt ===\n${block}`
        }).join('\n\n')
        downloadBlob(
          `${safeName}-notes-batch-${timestamp}.zip`,
          new Blob([manifest], { type: 'application/zip' }),
        )
      }
      resolve()
    }, 1800)
  })
}
