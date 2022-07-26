const generarId = () => {
  const fi = Math.random().toString(32).substring(2)
  const da = Date.now().toString(32)
  return fi + da
}

export default generarId
