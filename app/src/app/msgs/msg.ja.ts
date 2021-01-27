export const msgs = {
  common: {
    titleSuffix: ' - パスワード先に送ります',
    back: '戻る',
  },
  footer: {
    title: 'パスワード先に送ります',
  },
  home: {
    title: 'メニュー',
    keygen: 'パスワード作成',
    encrypt: '暗号化',
    decrypt: '暗号化解除',
  },
  keygen: {
    title: 'パスワード作成',
    genBtn: '作成',
    userPasswd: 'あなたのパスワード',
    publicPasswd: '教えるパスワード',
    secretPasswd: '秘密のパスワード',
  },
  encrypt: {
    title: '暗号化',
    publicPasswd: '教わったパスワードを貼り付け',
    fileSelectBtn: 'ファイルを選択',
    completed: '暗号化が完了しました！',
  },
  decrypt: {
    title: '暗号化解除',
    userPasswd: 'あなたのパスワードを入力',
    sercretPasswd: '秘密のパスワードを貼り付け',
    fileSelectBtn: 'ファイルを選択',
    completed: '暗号化を解除しました！',
  },
  errors: {
    decryptFile: {
      fileFormat: '暗号化されたファイルではありません',
      passwd: (pubKey: string) => {
        return `パスワードが違います\n(教えたパスワード: ${pubKey.substr(0, 5)}***)`;
      },
      decrypt: '解除に失敗しました',
    },
  },
};
