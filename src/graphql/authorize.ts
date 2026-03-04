type RolesOptions = {
  allowOwner?: boolean; // allow user to access their own resource
  ownerArgKey?: string; // which GraphQL arg to match (default: "id")
};

export const authorize =
  (roles: string[], options: RolesOptions = {}) =>
  (resolver: any) =>
  async (parent: any, args: any, context: any, info: any) => {
    const { allowOwner = false, ownerArgKey = "id" } = options;

    const user = context?.user;

    if (!user) {
      throw new Error("Not Authenticated");
    }

    if (roles.includes(user.role)) {
      return resolver(parent, args, context, info);
    }

    if (allowOwner) {
      const resourceId = args[ownerArgKey];
      if (resourceId && user.id === resourceId) {
        return resolver(parent, args, context, info);
      }
    }

    throw new Error("Forbidden");
  };
