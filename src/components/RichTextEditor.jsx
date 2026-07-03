import { useEditor, EditorContent, useEditorState } from '@tiptap/react'
import { useEffect, useState, useMemo, useRef, useCallback } from 'react'
import { buildEditorExtensions } from '../lib/tiptapExtensions'
import { MERGE_FIELD_OPTIONS } from '../lib/mergeFields'
import { usePrompt } from './ui'
import {
  EDITOR_FONTS,
  EDITOR_TEXT_SIZES,
  EDITOR_TEXT_COLORS,
  EDITOR_HIGHLIGHTS,
  EXPRESSIVE_SIZES,
  filterSlashCommands,
} from '../lib/editorFormatting'
import {
  IconUndo,
  IconRedo,
  IconBold,
  IconItalic,
  IconUnderline,
  IconBulletList,
  IconNumberList,
  IconLink,
  IconImage,
  IconTable,
  IconHorizontalRule,
  IconFillLine,
  IconSign,
  IconFormat,
  IconMic,
  IconAudioWave,
  IconHeading,
} from './EditorToolbarIcons'

function ToolbarDivider() {
  return <span className="doc-editor__divider" aria-hidden />
}

function ToolbarButton({ onClick, active, disabled, children, title, wide, className = '' }) {
  return (
    <button
      type="button"
      className={`doc-editor__btn${active ? ' doc-editor__btn--active' : ''}${wide ? ' doc-editor__btn--wide' : ''}${className ? ` ${className}` : ''}`}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
    >
      {children}
    </button>
  )
}

function useCloseOnOutsideClick(open, ref, onClose) {
  useEffect(() => {
    if (!open) return
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open, ref, onClose])
}

function MergeFieldMenu({ editor }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  useCloseOnOutsideClick(open, menuRef, () => setOpen(false))

  return (
    <div className="doc-editor__menu" ref={menuRef}>
      <ToolbarButton onClick={() => setOpen(o => !o)} active={open} title="Insert field">
        {'{ }'}
      </ToolbarButton>
      {open && (
        <ul className="doc-editor__menu-list">
          {MERGE_FIELD_OPTIONS.map(({ key, label }) => (
            <li key={key}>
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().insertMergeField(key).run()
                  setOpen(false)
                }}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function FormatMenu({ editor }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  useCloseOnOutsideClick(open, menuRef, () => setOpen(false))

  const apply = (fn) => {
    fn()
    setOpen(false)
  }

  return (
    <div className="doc-editor__menu doc-editor__menu--format" ref={menuRef}>
      <ToolbarButton onClick={() => setOpen(o => !o)} active={open} title="Font, size & colour">
        <IconFormat />
      </ToolbarButton>
      {open && (
        <div className="doc-editor__palette doc-editor__palette--format">
          <section className="doc-editor__palette-section">
            <h4 className="doc-editor__palette-title">Font</h4>
            <div className="doc-editor__palette-row">
              {EDITOR_FONTS.map(font => (
                <button
                  key={font.id}
                  type="button"
                  className="doc-editor__palette-font"
                  style={{ fontFamily: font.css }}
                  onClick={() => apply(() => editor.chain().focus().setFontFamily(font.id).run())}
                >
                  {font.label}
                </button>
              ))}
            </div>
          </section>
          <section className="doc-editor__palette-section">
            <h4 className="doc-editor__palette-title">Size</h4>
            <div className="doc-editor__palette-grid doc-editor__palette-grid--4">
              {EDITOR_TEXT_SIZES.map(size => (
                <button
                  key={size.id}
                  type="button"
                  className="doc-editor__palette-chip"
                  onClick={() => apply(() => editor.chain().focus().setStandardTextSize(size.id).run())}
                >
                  <span className={`doc-editor__palette-preview ${size.className}`}>Aa</span>
                  {size.label}
                </button>
              ))}
            </div>
          </section>
          <section className="doc-editor__palette-section">
            <h4 className="doc-editor__palette-title">Text colour</h4>
            <div className="doc-editor__palette-colors">
              {EDITOR_TEXT_COLORS.map(color => (
                <button
                  key={color.id}
                  type="button"
                  className={`doc-editor__color-swatch${color.id === 'default' ? ' doc-editor__color-swatch--default' : ''}`}
                  title={color.label}
                  aria-label={color.label}
                  style={color.hex ? { background: color.hex } : undefined}
                  onClick={() => apply(() => editor.chain().focus().setTextColor(color.id).run())}
                />
              ))}
            </div>
          </section>
          <section className="doc-editor__palette-section">
            <h4 className="doc-editor__palette-title">Highlight</h4>
            <div className="doc-editor__palette-grid">
              {EDITOR_HIGHLIGHTS.map(hl => (
                <button
                  key={hl.id}
                  type="button"
                  className="doc-editor__palette-chip"
                  onClick={() => apply(() => editor.chain().focus().setExpressiveHighlight(hl.id).run())}
                >
                  {hl.isClear ? (
                    <span className="doc-editor__palette-swatch doc-editor__palette-swatch--clear">×</span>
                  ) : (
                    <span className={`doc-editor__palette-swatch ${hl.className}`} />
                  )}
                  {hl.label}
                </button>
              ))}
            </div>
          </section>
          <section className="doc-editor__palette-section">
            <h4 className="doc-editor__palette-title">Expressive presence</h4>
            <div className="doc-editor__palette-grid">
              {EXPRESSIVE_SIZES.filter(s => s.id !== 'standard').map(size => (
                <button
                  key={size.id}
                  type="button"
                  className="doc-editor__palette-chip"
                  onClick={() => apply(() => editor.chain().focus().setExpressiveSize(size.id).run())}
                >
                  <span className={`doc-editor__palette-preview ${size.className}`}>Aa</span>
                  {size.label}
                </button>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

function AudioHub({ isDictating, onToggleDictate, onAddFragment }) {
  return (
    <div className="doc-editor__audio-hub">
      <ToolbarButton
        onClick={onToggleDictate}
        active={isDictating}
        title={isDictating ? 'Stop dictation (mock)' : 'Dictate'}
        className={isDictating ? 'doc-editor__btn--dictating' : ''}
      >
        <span className="doc-editor__mic" aria-hidden>
          {isDictating && <span className="doc-editor__mic-pulse" />}
          <IconMic />
        </span>
      </ToolbarButton>
      <ToolbarButton onClick={onAddFragment} title="Add audio fragment block">
        <IconAudioWave />
      </ToolbarButton>
    </div>
  )
}

function SlashCommandPalette({ open, query, items, selectedIndex, onPick, onHover }) {
  if (!open) return null

  return (
    <div className="doc-editor__slash" role="listbox" aria-label="Slash commands">
      <p className="doc-editor__slash-hint">Formatting & media blocks</p>
      {items.length === 0 ? (
        <p className="doc-editor__slash-empty">No matching commands</p>
      ) : (
        <ul className="doc-editor__slash-list">
          {items.map((item, index) => (
            <li key={item.id}>
              <button
                type="button"
                role="option"
                aria-selected={index === selectedIndex}
                className={`doc-editor__slash-item${index === selectedIndex ? ' doc-editor__slash-item--active' : ''}`}
                onMouseEnter={() => onHover(index)}
                onClick={() => onPick(item)}
              >
                <span className="doc-editor__slash-label">{item.label}</span>
                <span className="doc-editor__slash-group">{item.group}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function runSlashCommand(editor, command, pickArtworkFile) {
  if (!editor || editor.isDestroyed || !command) return

  switch (command.action) {
    case 'textSize':
      editor.chain().focus().setStandardTextSize(command.value).run()
      break
    case 'size':
      editor.chain().focus().setExpressiveSize(command.value).run()
      break
    case 'textColor':
      editor.chain().focus().setTextColor(command.value).run()
      break
    case 'highlight':
      editor.chain().focus().setExpressiveHighlight(command.value).run()
      break
    case 'audio':
      editor.chain().focus().insertAudioFragment({ label: 'Verbal reflection', duration: '0:38' }).run()
      break
    case 'artwork':
      pickArtworkFile?.()
      break
    case 'heading':
      editor.chain().focus().toggleHeading({ level: command.value }).run()
      break
    case 'divider':
      editor.chain().focus().setHorizontalRule().run()
      break
    default:
      break
  }
}

function DocToolbar({
  editor,
  mode,
  clinicianProfile,
  isDictating,
  onToggleDictate,
  onAddAudioFragment,
  onAddArtwork,
}) {
  const prompt = usePrompt()
  const toolbar = useEditorState({
    editor,
    selector: ({ editor: ed }) => {
      if (!ed || ed.isDestroyed) return null
      return {
        isBold: ed.isActive('bold'),
        isItalic: ed.isActive('italic'),
        isUnderline: ed.isActive('underline'),
        isH1: ed.isActive('heading', { level: 1 }),
        isH2: ed.isActive('heading', { level: 2 }),
        isParagraph: ed.isActive('paragraph'),
        isBullet: ed.isActive('bulletList'),
        isOrdered: ed.isActive('orderedList'),
        isLink: ed.isActive('link'),
        canUndo: ed.can().undo(),
        canRedo: ed.can().redo(),
      }
    },
  })

  if (!editor || editor.isDestroyed || !toolbar) return null

  const addLink = async () => {
    const previous = editor.getAttributes('link').href
    const url = await prompt({ title: 'Add link', label: 'Link URL', defaultValue: previous || 'https://' })
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  const insertFillLine = async () => {
    const label = await prompt({ title: 'Insert fill-in field', label: 'Field label (optional)', defaultValue: '' })
    if (label === null) return
    editor
      .chain()
      .focus()
      .insertContent(
        `<p class="fill-line">${label ? `<span class="fill-line__label">${label}: </span>` : ''}<span class="fill-line__blank">_______________________________________________</span></p>`,
      )
      .run()
  }

  const isClinical = mode === 'clinical'

  return (
    <div className="doc-editor__toolbar" role="toolbar" aria-label="Formatting">
      <div className="doc-editor__toolbar-group">
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!toolbar.canUndo} title="Undo">
          <IconUndo />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!toolbar.canRedo} title="Redo">
          <IconRedo />
        </ToolbarButton>
      </div>
      <ToolbarDivider />
      <div className="doc-editor__toolbar-group">
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={toolbar.isH1} title="Title">
          <IconHeading level={1} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={toolbar.isH2} title="Heading">
          <IconHeading level={2} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setParagraph().run()} active={toolbar.isParagraph} title="Normal text">
          <span className="doc-editor__icon-text">P</span>
        </ToolbarButton>
      </div>
      <ToolbarDivider />
      <div className="doc-editor__toolbar-group">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={toolbar.isBold} title="Bold">
          <IconBold />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={toolbar.isItalic} title="Italic">
          <IconItalic />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={toolbar.isUnderline} title="Underline">
          <IconUnderline />
        </ToolbarButton>
      </div>
      <ToolbarDivider />
      <FormatMenu editor={editor} />
      <ToolbarDivider />
      <div className="doc-editor__toolbar-group">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={toolbar.isBullet} title="Bullet list">
          <IconBulletList />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={toolbar.isOrdered} title="Numbered list">
          <IconNumberList />
        </ToolbarButton>
      </div>
      <ToolbarDivider />
      <AudioHub
        isDictating={isDictating}
        onToggleDictate={onToggleDictate}
        onAddFragment={onAddAudioFragment}
      />

      {isClinical && (
        <>
          <ToolbarDivider />
          <div className="doc-editor__toolbar-group">
            <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal line">
              <IconHorizontalRule />
            </ToolbarButton>
            <ToolbarButton onClick={insertFillLine} title="Fill-in line">
              <IconFillLine />
            </ToolbarButton>
            <ToolbarButton onClick={addLink} active={toolbar.isLink} title="Link">
              <IconLink />
            </ToolbarButton>
            <ToolbarButton onClick={onAddArtwork} title="Embed artwork">
              <IconImage />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
              title="Insert table"
            >
              <IconTable />
            </ToolbarButton>
            <MergeFieldMenu editor={editor} />
            <ToolbarButton
              onClick={() => editor.chain().focus().insertSignature().run()}
              title={clinicianProfile?.full_name ? `Insert signature (${clinicianProfile.full_name})` : 'Insert signature from profile'}
            >
              <IconSign />
            </ToolbarButton>
          </div>
        </>
      )}

      {!isClinical && (
        <>
          <ToolbarDivider />
          <div className="doc-editor__toolbar-group">
            <ToolbarButton onClick={addLink} active={toolbar.isLink} title="Link">
              <IconLink />
            </ToolbarButton>
            <ToolbarButton onClick={onAddArtwork} title="Embed artwork">
              <IconImage />
            </ToolbarButton>
          </div>
        </>
      )}
    </div>
  )
}

/**
 * One editor instance per React `key` on this component.
 * Parent must change `key` when switching documents — do not change `content` alone.
 */
export default function RichTextEditor({
  content,
  onChange,
  editable = true,
  variant = 'default',
  mode = 'basic',
  mergeContext = null,
  clinicianProfile = null,
  onEditorReady = null,
}) {
  const [surfaceReady, setSurfaceReady] = useState(false)
  const [isDictating, setIsDictating] = useState(false)
  const [slashOpen, setSlashOpen] = useState(false)
  const [slashQuery, setSlashQuery] = useState('')
  const [slashIndex, setSlashIndex] = useState(0)
  const slashFromRef = useRef(null)
  const canvasRef = useRef(null)
  const editorRef = useRef(null)
  const slashOpenRef = useRef(false)
  const slashQueryRef = useRef('')
  const slashIndexRef = useRef(0)

  const extensions = useMemo(() => buildEditorExtensions(mode), [mode])
  const slashItems = useMemo(() => filterSlashCommands(slashQuery), [slashQuery])

  useEffect(() => { slashOpenRef.current = slashOpen }, [slashOpen])
  useEffect(() => { slashQueryRef.current = slashQuery }, [slashQuery])
  useEffect(() => { slashIndexRef.current = slashIndex }, [slashIndex])

  const pickArtworkFile = useCallback((editorInstance) => {
    const ed = editorInstance
    if (!ed || ed.isDestroyed) return
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = () => {
      const file = input.files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = () => {
        ed.chain().focus().insertArtworkEmbed({
          src: reader.result,
          align: 'left',
          caption: file.name.replace(/\.[^.]+$/, '') || 'Client artwork',
        }).run()
      }
      reader.readAsDataURL(file)
    }
    input.click()
  }, [])

  const closeSlash = useCallback(() => {
    setSlashOpen(false)
    slashOpenRef.current = false
    setSlashQuery('')
    slashQueryRef.current = ''
    setSlashIndex(0)
    slashIndexRef.current = 0
    slashFromRef.current = null
  }, [])

  const executeSlash = useCallback((command, editorInstance) => {
    if (!editorInstance || editorInstance.isDestroyed) return
    const from = slashFromRef.current
    if (typeof from === 'number') {
      const to = editorInstance.state.selection.from
      editorInstance.chain().focus().deleteRange({ from, to }).run()
    }
    runSlashCommand(editorInstance, command, () => pickArtworkFile(editorInstance))
    closeSlash()
  }, [closeSlash, pickArtworkFile])

  const editor = useEditor({
    immediatelyRender: true,
    shouldRerenderOnTransaction: false,
    extensions,
    content: content || '<p></p>',
    editable,
    onUpdate: ({ editor: ed }) => onChange?.(ed.getHTML()),
    onCreate: ({ editor: ed }) => {
      if (mode !== 'clinical') return
      if (ed.storage.mergeContext) {
        ed.storage.mergeContext.values = mergeContext || {}
      }
      if (ed.storage.clinicianProfile) {
        ed.storage.clinicianProfile.profile = clinicianProfile || {}
      }
    },
    editorProps: {
      attributes: {
        class: 'doc-editor__prose',
        spellcheck: 'true',
      },
      handleKeyDown: (_view, event) => {
        if (!editable) return false

        if (slashOpenRef.current) {
          const items = filterSlashCommands(slashQueryRef.current)

          if (event.key === 'Escape') {
            closeSlash()
            return true
          }
          if (event.key === 'ArrowDown') {
            event.preventDefault()
            setSlashIndex(i => {
              const next = (i + 1) % Math.max(items.length, 1)
              slashIndexRef.current = next
              return next
            })
            return true
          }
          if (event.key === 'ArrowUp') {
            event.preventDefault()
            setSlashIndex(i => {
              const next = (i - 1 + Math.max(items.length, 1)) % Math.max(items.length, 1)
              slashIndexRef.current = next
              return next
            })
            return true
          }
          if (event.key === 'Enter') {
            event.preventDefault()
            const cmd = items[slashIndexRef.current]
            if (cmd && editorRef.current) executeSlash(cmd, editorRef.current)
            return true
          }
          if (event.key === 'Backspace') {
            if (slashQueryRef.current.length === 0) {
              closeSlash()
              return false
            }
            event.preventDefault()
            setSlashQuery(q => {
              const next = q.slice(0, -1)
              slashQueryRef.current = next
              return next
            })
            setSlashIndex(0)
            return true
          }
          if (event.key.length === 1 && !event.metaKey && !event.ctrlKey) {
            event.preventDefault()
            setSlashQuery(q => {
              const next = q + event.key
              slashQueryRef.current = next
              return next
            })
            setSlashIndex(0)
            return true
          }
        }

        if (event.key === '/' && !event.shiftKey) {
          const { $from } = _view.state.selection
          const textBefore = $from.parent.textBetween(0, $from.parentOffset, undefined, '\ufffc')
          if (textBefore === '' || /\s$/.test(textBefore)) {
            slashFromRef.current = $from.pos
            setSlashOpen(true)
            slashOpenRef.current = true
            setSlashQuery('')
            slashQueryRef.current = ''
            setSlashIndex(0)
            slashIndexRef.current = 0
            return false
          }
        }

        return false
      },
    },
  }, [extensions])

  useEffect(() => {
    editorRef.current = editor
  }, [editor])

  useEffect(() => {
    setSurfaceReady(false)
    const frame = requestAnimationFrame(() => setSurfaceReady(true))
    return () => {
      cancelAnimationFrame(frame)
      setSurfaceReady(false)
    }
  }, [])

  useEffect(() => {
    if (!editor || editor.isDestroyed) return
    editor.setEditable(editable)
  }, [editor, editable])

  useEffect(() => {
    if (!editor || editor.isDestroyed || mode !== 'clinical') return
    if (editor.storage.mergeContext) {
      editor.storage.mergeContext.values = mergeContext || {}
    }
    if (editor.storage.clinicianProfile) {
      editor.storage.clinicianProfile.profile = clinicianProfile || {}
    }
  }, [editor, mergeContext, clinicianProfile, mode])

  useEffect(() => {
    if (!editor || editor.isDestroyed) return
    onEditorReady?.(editor)
    return () => onEditorReady?.(null)
  }, [editor, onEditorReady])

  useEffect(() => {
    if (!isDictating || !editor || editor.isDestroyed) return
    const id = window.setInterval(() => {
      editor.chain().focus().insertContent(' spoken reflection ').run()
    }, 2800)
    return () => window.clearInterval(id)
  }, [isDictating, editor])

  const handleToggleDictate = () => setIsDictating(d => !d)

  const handleAddAudioFragment = () => {
    if (!editor || editor.isDestroyed) return
    editor.chain().focus().insertAudioFragment({
      label: isDictating ? 'Live dictation capture' : 'Session audio fragment',
      duration: isDictating ? '0:12' : '0:42',
    }).run()
  }

  const handleAddArtwork = () => pickArtworkFile(editor)

  if (!editor || editor.isDestroyed || !surfaceReady) {
    return (
      <div className={`doc-editor doc-editor--loading doc-editor--${variant}`}>
        <div className="doc-editor__canvas">
          <div className="doc-editor__page doc-editor__page--skeleton" />
        </div>
      </div>
    )
  }

  return (
    <div className={`doc-editor doc-editor--${variant}${!editable ? ' doc-editor--readonly' : ''}${mode === 'clinical' ? ' doc-editor--clinical' : ''}${isDictating ? ' doc-editor--dictating' : ''}`}>
      {editable && editor && !editor.isDestroyed && (
        <DocToolbar
          editor={editor}
          mode={mode}
          clinicianProfile={clinicianProfile}
          isDictating={isDictating}
          onToggleDictate={handleToggleDictate}
          onAddAudioFragment={handleAddAudioFragment}
          onAddArtwork={handleAddArtwork}
        />
      )}
      <div className="doc-editor__canvas" ref={canvasRef}>
        <SlashCommandPalette
          open={slashOpen}
          query={slashQuery}
          items={slashItems}
          selectedIndex={slashIndex}
          onPick={(cmd) => executeSlash(cmd, editor)}
          onHover={setSlashIndex}
        />
        <div className="doc-editor__page">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  )
}
