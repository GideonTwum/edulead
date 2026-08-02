"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import { Button, Space, Divider } from "antd";
import {
  BoldOutlined,
  ItalicOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  LinkOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import { useEffect } from "react";

interface RichTextEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}

export function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Write content...",
  minHeight = 200,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
      Youtube.configure({ width: 640, height: 360 }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none px-3 py-2",
        style: `min-height: ${minHeight}px`,
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChange?.(ed.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, false);
    }
  }, [value, editor]);

  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt("Enter URL");
    if (url) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt("Enter image URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-brand-border bg-white">
      <div className="flex flex-wrap items-center gap-1 border-b border-brand-border bg-brand-off-white px-2 py-1">
        <Space size={4} wrap>
          <Button
            type={editor.isActive("bold") ? "primary" : "text"}
            size="small"
            icon={<BoldOutlined />}
            onClick={() => editor.chain().focus().toggleBold().run()}
          />
          <Button
            type={editor.isActive("italic") ? "primary" : "text"}
            size="small"
            icon={<ItalicOutlined />}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          />
          <Divider type="vertical" />
          <Button
            type={editor.isActive("bulletList") ? "primary" : "text"}
            size="small"
            icon={<UnorderedListOutlined />}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          />
          <Button
            type={editor.isActive("orderedList") ? "primary" : "text"}
            size="small"
            icon={<OrderedListOutlined />}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          />
          <Divider type="vertical" />
          <Button type="text" size="small" icon={<LinkOutlined />} onClick={addLink} />
          <Button type="text" size="small" icon={<PictureOutlined />} onClick={addImage} />
        </Space>
      </div>
      <EditorContent editor={editor} />
      {!value && (
        <p className="pointer-events-none absolute px-3 text-sm text-brand-grey opacity-50">{placeholder}</p>
      )}
    </div>
  );
}
