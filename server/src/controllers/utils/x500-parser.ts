/**
 * Build a JSON object from a X500 Distinguished Name.
 * See https://tools.ietf.org/html/rfc4514
 * @param x500dn X500 Distinguished Name
 */
export function deserializeX500DN(x500dn: string): X500DistinguishedName {

  /**
   * Split a string using a specific character delimiter, but don't split if the delimiter is escaped.
   * This function is equivalent to .split(/(?<!\\){c}/) but this regex is not supported on FireFox or Safari.
   * @param delim character delimiter
   * @param str string to split
   */
  function splitUnescaped(delim, str) {
    const result = [];
    let previousChar;
    let start = 0;
    for (let i = 0; i < str.length; i++) {
      const currentChar = str.charAt(i);
      if (currentChar === delim && previousChar !== '\\') {
        result.push(str.slice(start, i));
        i++;
        start = i;
      }
      if (i >= str.length - 1) {
        result.push(str.slice(start, i + 1));
      }
      previousChar = currentChar;
    }
    return result;
  }

  const identity: X500DistinguishedName = {};
  const attrs = splitUnescaped(',', x500dn); // split at ',' but not at '\,'
  attrs.forEach((attr) => {
    const keyValue = splitUnescaped('=', attr); // split at '=' but not at '\='
    const key = keyValue[0];
    const value = keyValue[1]
      .replace('\\ ', ' ')        // unescape whitespace
      .replace('\\=', '=')        // unescape =
      .replace('\\"', '"')        // unescape "
      .replace('\\,', ',')        // unescape ,
      .replace('\\;', ';')        // unescape ;
      .replace('\\+', '+');       // unescape +
    switch (key.toUpperCase().trim()) {
      case 'CN':
        identity.commonName = value;
        break;
      case 'EMAILADDRESS':
        identity.emailAddress = value;
        break;
      case 'O':
        identity.organization = value;
        break;
      case 'OU':
        identity.organizationalUnit = value;
        break;
      case 'L':
        identity.locality = value;
        break;
      case 'C':
        identity.country = value;
        break;
    }
  });
  return identity;
}

interface X500DistinguishedName {
  commonName?: string;
  emailAddress?: string;
  organization?: string;
  organizationalUnit?: string;
  locality?: string;
  country?: string;
}
