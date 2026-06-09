Chat bubble for the Kapri concierge — the building block of every conversation.

```jsx
<MessageBubble role="user">I need a gift for my mother</MessageBubble>
<MessageBubble role="kapri">Mata hondha ideas tikak thiyenawa! 🎁</MessageBubble>
<MessageBubble role="kapri" sinhala>අම්මට ලස්සන තෑගි මෙන්න!</MessageBubble>
```

`user` = purple, right, tail top-right. `kapri` = purple-100 + 🛍️ avatar, left, tail top-left. Pass `sinhala` for සිංහල/Tanglish text. Generative-UI cards (carousels, delivery, checkout) render as siblings *below* a short Kapri bubble — never re-list products as text.
