const Roles: any = [
  {
    role: "SYS_ADMIN",
    // permissions: ["ALL"],
  },
  {
    role: "ADMIN",
    // permissions: ["ALL"],
  },
  {
    role: "ENDUSER",
    // permissions: ["VIEW"],
  },
  {
    role: "AUTHORIZER",
    // permissions: ["APPROVE"],
  },
  {
    role: "REVIEW_STAGE_2",
    // permissions: ["APPROVE", "AUTHORIZE"],
  },
];

enum Role {
  ENDUSER,
  ADMIN,
  AUTHORIZER,
}

export default Roles;
