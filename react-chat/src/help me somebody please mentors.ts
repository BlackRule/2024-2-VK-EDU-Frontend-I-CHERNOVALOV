// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
type User = {
  avatar: string,
  bio: string,
  first_name: string,
  id: string,
  last_name: string,
  username: string
}
type Auth = { access: string, refresh: string };
type UserGetInput={ user_id: 'current' | string }
type AuthPostInput = { login: string, password: string }
//I use Pycharm 2024.2.4

///////////////////////////////////////////////////////////////////

// When (1)
type ApiTuple =
  | ['user/GET', UserGetInput]
  | ['auth/POST', AuthPostInput];

async function api(
  url: 'user/GET',
  data: UserGetInput
): Promise<User>;
async function api(
  url: 'auth/POST',
  data: AuthPostInput
): Promise<Auth>;
async function api<R>(
  ...[url, data]:ApiTuple
): Promise<R> {
}
/*fixme IDE suggests ALL props i.e login password and user_id
    though it complains about incompatibility 🤷‍♀️
 */
const res2 = await api('user/GET', { /* HERE*/ })



//////////////////////////////////////////////////////////////////////
// And when (2)
type ApiInputMap = {
  'auth/POST': AuthPostInput;
  'user/GET': UserGetInput;
};

type ApiOutputMap = {
  'auth/POST': Auth;
  'user/GET': User;
};
async function api2<K extends keyof ApiInputMap>(
  url: K,
  data: ApiInputMap[K]
): Promise<ApiOutputMap[K]> {

  switch (url) {
    case 'user/GET':
    /*fixme HERE data: UserGetInput | AuthPostInput and IDE completion of
       data.HERE doesn't work but I don't want to use `as`. I believe TS should know the type*/
    break
  }
}