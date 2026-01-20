export const session = app.__session_info__ || {};
delete app.__session_info__;
