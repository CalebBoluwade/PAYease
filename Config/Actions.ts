import Roles from "./Roles";

const Actions = [
  {
    actionName: "DELETE",
    allowAction: true,
    allowUser: [Roles.role["SYS_ADMIN"]],
  },
  {
    actionName: "ADD-BENEFICIARY",
    allowAction: true,
    allowUser: [Roles.role["SYS_ADMIN"], Roles.role["ADMIN"]],
  },
];

export default Actions;
