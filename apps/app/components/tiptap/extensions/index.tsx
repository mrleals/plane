import StarterKit from "@tiptap/starter-kit";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import TiptapLink from "@tiptap/extension-link";
import TiptapImage from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TiptapUnderline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { Markdown } from "tiptap-markdown";
import Highlight from "@tiptap/extension-highlight";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { lowlight } from 'lowlight/lib/core'
import SlashCommand from "../slash-command";
import { InputRule } from "@tiptap/core";
import { Node as ProseMirrorNode } from '@tiptap/pm/model';

import ts from 'highlight.js/lib/languages/typescript'

import 'highlight.js/styles/github-dark.css';
import UploadImagesPlugin from "../plugins/upload-image";
import UniqueID from "@tiptap-pro/extension-unique-id";

lowlight.registerLanguage('ts', ts)

const CustomImage = TiptapImage.extend({
  addProseMirrorPlugins() {
    return [UploadImagesPlugin()];
  },
});

export const TiptapExtensions = [
  StarterKit.configure({
    bulletList: {
      HTMLAttributes: {
        class: "list-disc list-outside leading-3 -mt-2",
      },
    },
    orderedList: {
      HTMLAttributes: {
        class: "list-decimal list-outside leading-3 -mt-2",
      },
    },
    listItem: {
      HTMLAttributes: {
        class: "leading-normal -mb-2",
      },
    },
    blockquote: {
      HTMLAttributes: {
        class: "border-l-4 border-stone-700",
      },
    },
    code: {
      HTMLAttributes: {
        class:
          "rounded-md bg-custom-bg-1000 px-1 py-1 font-mono font-medium text-stone-900",
        spellcheck: "false",
      },
    },
    codeBlock: false,
    horizontalRule: false,
    dropcursor: {
      color: "#DBEAFE",
      width: 2,
    },
    gapcursor: false,
  }),
  CodeBlockLowlight.configure({
    lowlight,
  }),
  HorizontalRule.extend({
    addInputRules() {
      return [
        new InputRule({
          find: /^(?:---|—-|___\s|\*\*\*\s)$/,
          handler: ({ state, range }) => {
            const attributes = {};

            const { tr } = state;
            const start = range.from;
            const end = range.to;
            const node = this.type.create(attributes) as unknown as ProseMirrorNode;
            tr.insert(start - 1, node).delete(
              tr.mapping.map(start),
              tr.mapping.map(end),
            );
          },
        }),
      ];
    },
  }).configure({
    HTMLAttributes: {
      class: "mb-6 border-t border-custom-border-400",
    },
  }),
  TiptapLink.configure({
    HTMLAttributes: {
      class:
        "text-stone-400 underline underline-offset-[3px] hover:text-stone-600 transition-colors cursor-pointer",
    },
  }),
  CustomImage.configure({
    allowBase64: true,
    HTMLAttributes: {
      class: "rounded-lg border border-stone-200",
    },
  }),
  Placeholder.configure({
    placeholder: ({ node }) => {
      if (node.type.name === "heading") {
        return `Heading ${node.attrs.level}`;
      }

      return "Press '/' for commands...";
    },
    includeChildren: true,
  }),
  UniqueID.configure({
    types: ['image'],
  }),
  SlashCommand,
  TiptapUnderline,
  TextStyle,
  Color,
  Highlight.configure({
    multicolor: true,
  }),
  TaskList.configure({
    HTMLAttributes: {
      class: "not-prose pl-2",
    },
  }),
  TaskItem.configure({
    HTMLAttributes: {
      class: "flex items-start my-4",
    },
    nested: true,
  }),
  Markdown.configure({
    html: true,
    transformCopiedText: true,
  }),
];
