// 二进制转换base64
export const binaryToBase64 = (binary: ArrayBufferLike): string => {
  return btoa(
    new Uint8Array(binary).reduce(
      (data: string, byte: number) => data + String.fromCharCode(byte),
      ''
    )
  )
}

export const a = () => {
  return true
}
