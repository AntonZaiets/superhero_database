export const validateSuperhero = (req, res, next) => {
  const { nickname, real_name, origin_description, superpowers, catch_phrase } = req.body;

  const errors = [];

  if (!nickname || !nickname.trim()) {
    errors.push('Nickname is required');
  }

  if (!real_name || !real_name.trim()) {
    errors.push('Real name is required');
  }

  if (!origin_description || !origin_description.trim()) {
    errors.push('Origin description is required');
  }

  if (!superpowers || !superpowers.trim()) {
    errors.push('Superpowers is required');
  }

  if (!catch_phrase || !catch_phrase.trim()) {
    errors.push('Catch phrase is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      messages: errors,
    });
  }

  next();
};
