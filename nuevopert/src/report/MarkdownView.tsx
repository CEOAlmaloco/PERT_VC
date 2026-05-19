import type { CSSProperties, ReactNode } from "react"
import { colors } from "./theme"

type Props = {
  source: string
}

export function MarkdownView({ source }: Props) {
  const blocks = parseMarkdown(source)
  return (
    <article style={{ fontSize: 14, lineHeight: 1.6, color: colors.text }}>
      {blocks.map((block, i) => renderBlock(block, i))}
    </article>
  )
}

type Block =
  | { type: "h1"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "code"; text: string }
  | { type: "hr" }
  | { type: "blockquote"; text: string }

function parseMarkdown(md: string): Block[] {
  const lines = md.replace(/\r\n/g, "\n").split("\n")
  const blocks: Block[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i] ?? ""

    if (line.startsWith("```")) {
      const codeLines: string[] = []
      i++
      while (i < lines.length && !(lines[i] ?? "").startsWith("```")) {
        codeLines.push(lines[i] ?? "")
        i++
      }
      blocks.push({ type: "code", text: codeLines.join("\n") })
      i++
      continue
    }

    if (line.startsWith("|") && line.includes("|")) {
      const tableLines: string[] = []
      while (i < lines.length && (lines[i] ?? "").trim().startsWith("|")) {
        tableLines.push(lines[i] ?? "")
        i++
      }
      const rows = tableLines
        .filter((r) => !/^\|[\s\-:|]+\|$/.test(r.trim()))
        .map((r) =>
          r
            .split("|")
            .slice(1, -1)
            .map((c) => c.trim()),
        )
      if (rows.length > 0) {
        blocks.push({ type: "table", headers: rows[0]!, rows: rows.slice(1) })
      }
      continue
    }

    if (/^---+$/.test(line.trim())) {
      blocks.push({ type: "hr" })
      i++
      continue
    }

    if (line.startsWith("### ")) {
      blocks.push({ type: "h3", text: line.slice(4) })
      i++
      continue
    }
    if (line.startsWith("## ")) {
      blocks.push({ type: "h2", text: line.slice(3) })
      i++
      continue
    }
    if (line.startsWith("# ")) {
      blocks.push({ type: "h1", text: line.slice(2) })
      i++
      continue
    }

    if (line.startsWith("> ")) {
      const quote: string[] = [line.slice(2)]
      i++
      while (i < lines.length && (lines[i] ?? "").startsWith("> ")) {
        quote.push((lines[i] ?? "").slice(2))
        i++
      }
      blocks.push({ type: "blockquote", text: quote.join(" ") })
      continue
    }

    if (/^[-*] /.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^[-*] /.test(lines[i] ?? "")) {
        items.push((lines[i] ?? "").replace(/^[-*] /, ""))
        i++
      }
      blocks.push({ type: "ul", items })
      continue
    }

    if (/^\d+\. /.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\d+\. /.test(lines[i] ?? "")) {
        items.push((lines[i] ?? "").replace(/^\d+\. /, ""))
        i++
      }
      blocks.push({ type: "ol", items })
      continue
    }

    if (line.trim() === "") {
      i++
      continue
    }

    const para: string[] = [line]
    i++
    while (i < lines.length && (lines[i] ?? "").trim() !== "" && !isBlockStart(lines[i] ?? "")) {
      para.push(lines[i] ?? "")
      i++
    }
    blocks.push({ type: "p", text: para.join(" ") })
  }

  return blocks
}

function isBlockStart(line: string): boolean {
  return (
    line.startsWith("#") ||
    line.startsWith("|") ||
    line.startsWith("```") ||
    line.startsWith("> ") ||
    /^[-*] /.test(line) ||
    /^\d+\. /.test(line) ||
    /^---+$/.test(line.trim())
  )
}

function renderInline(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} style={{ color: colors.navy }}>
          {part.slice(2, -2)}
        </strong>
      )
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} style={{ fontFamily: "ui-monospace, monospace", fontSize: "0.92em" }}>
          {part.slice(1, -1)}
        </code>
      )
    }
    return part
  })
}

function renderBlock(block: Block, key: number) {
  switch (block.type) {
    case "h1":
      return (
        <h1 key={key} style={{ fontSize: 22, fontWeight: 800, color: colors.navy, margin: "0 0 16px" }}>
          {renderInline(block.text)}
        </h1>
      )
    case "h2":
      return (
        <h2
          key={key}
          style={{
            fontSize: 17,
            fontWeight: 700,
            color: colors.navy,
            margin: "28px 0 12px",
            paddingBottom: 6,
            borderBottom: `2px solid ${colors.border}`,
          }}
        >
          {renderInline(block.text)}
        </h2>
      )
    case "h3":
      return (
        <h3 key={key} style={{ fontSize: 14, fontWeight: 700, color: colors.blue, margin: "20px 0 8px" }}>
          {renderInline(block.text)}
        </h3>
      )
    case "p":
      return (
        <p key={key} style={{ margin: "0 0 12px" }}>
          {renderInline(block.text)}
        </p>
      )
    case "ul":
      return (
        <ul key={key} style={{ margin: "0 0 14px", paddingLeft: 22 }}>
          {block.items.map((item, j) => (
            <li key={j} style={{ marginBottom: 4 }}>
              {renderInline(item)}
            </li>
          ))}
        </ul>
      )
    case "ol":
      return (
        <ol key={key} style={{ margin: "0 0 14px", paddingLeft: 22 }}>
          {block.items.map((item, j) => (
            <li key={j} style={{ marginBottom: 4 }}>
              {renderInline(item)}
            </li>
          ))}
        </ol>
      )
    case "table":
      return (
        <div key={key} style={{ overflowX: "auto", margin: "0 0 16px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr>
                {block.headers.map((h, j) => (
                  <th key={j} style={th}>
                    {renderInline(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci} style={td}>
                      {renderInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    case "code":
      return (
        <pre key={key} style={pre}>
          {block.text}
        </pre>
      )
    case "hr":
      return <hr key={key} style={{ border: "none", borderTop: `1px solid ${colors.border}`, margin: "24px 0" }} />
    case "blockquote":
      return (
        <blockquote key={key} style={quote}>
          {renderInline(block.text)}
        </blockquote>
      )
    default:
      return null
  }
}

const th: CSSProperties = {
  padding: "8px 10px",
  textAlign: "left",
  background: colors.surface,
  borderBottom: `2px solid ${colors.border}`,
  fontWeight: 700,
  color: colors.navy,
}

const td: CSSProperties = {
  padding: "8px 10px",
  borderBottom: `1px solid ${colors.border}`,
  verticalAlign: "top",
}

const pre: CSSProperties = {
  margin: "0 0 14px",
  padding: "12px 14px",
  background: "#f8fafc",
  border: `1px solid ${colors.border}`,
  borderRadius: 8,
  fontSize: 12,
  overflowX: "auto",
  fontFamily: "ui-monospace, monospace",
  whiteSpace: "pre-wrap",
}

const quote: CSSProperties = {
  margin: "0 0 14px",
  padding: "10px 14px",
  background: colors.orangeLight,
  borderLeft: `4px solid ${colors.orange}`,
  fontSize: 13,
}
