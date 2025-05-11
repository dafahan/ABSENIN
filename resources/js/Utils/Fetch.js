export const routeCollection = (name, param = null) => {
  const [varName, action] = name.split('.');

  if (action === 'store') {
    return `/${varName}`; // For store, return just the base path.
  }

  if (action === 'update' || action === 'destroy') {
    return `/${varName}/${param}`; // For update or destroy, append param to the base path.
  }

  throw new Error(`Unknown route: ${name}`);
};
