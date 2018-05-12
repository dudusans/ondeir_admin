export interface EnumItem<E> { id: E; name: keyof E; }

export class Utils {

  public static validateEmail(email) {
    // tslint:disable-next-line:max-line-length
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  public static enumToArray<E>(Enum: any): Array<EnumItem<E>> {
    const keys = Object.keys(Enum).filter(k => typeof Enum[k as any] === "number");
    return keys.map(key => ({id: Enum[key], name: key} as EnumItem<E>))
  }
}
