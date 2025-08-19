export const heroToDto = (heroDocOrPlain, req) => {
  const base = `${req.protocol}://${req.get('host')}`;
  const h = typeof heroDocOrPlain.toJSON === 'function' ? heroDocOrPlain.toJSON() : heroDocOrPlain;

  return {
    id: h.id,
    nickname: h.nickname,
    real_name: h.real_name,
    origin_description: h.origin_description,
    superpowers: h.superpowers,
    catch_phrase: h.catch_phrase,
    images: (h.images || []).map((img) => ({
      fileId: String(img.fileId),
      filename: img.filename,
      contentType: img.contentType,
      uploadDate: img.uploadDate,
      url: `${base}/api/superheroes/${h.id}/images/${img.fileId}`,
    })),
    created_at: h.created_at,
    updated_at: h.updated_at,
  };
};
