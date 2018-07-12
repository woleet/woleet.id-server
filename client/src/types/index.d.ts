/* Client types */
import '../../../types/api.user';
import '../../../types/api.key';
import '../../../types/api';

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
