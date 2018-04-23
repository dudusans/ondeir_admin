export class LoginResultEntity {
  loginAccept: boolean;
  userName: string;
  authenticationToken: string;
  type: number;
  userId: number;
  cityId: number;
  cities: Array<any>;

  public static GetInstance(): LoginResultEntity {
    const instance = new LoginResultEntity();
    instance.loginAccept = false;
    instance.type = 1;
    instance.userId = 1;
    instance.cityId = 0;
    instance.cities = new Array<any>();


    return instance;
  }
}
