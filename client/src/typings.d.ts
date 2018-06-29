/* Client types */
import '../../typings/api.user';
import '../../typings/api';

/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

declare global {

  interface BasicAuthObject {
    username: string;
    password: string;
  }

}
