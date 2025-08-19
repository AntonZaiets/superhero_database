export const ok = (res, payload, status = 200, meta = undefined) => {
  const body = { success: true, ...payload };
  if (meta) body.meta = meta;
  res.status(status).json(body);
};
