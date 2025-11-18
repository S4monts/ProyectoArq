function isISODate(str) {
  return /^\d{4}-\d{2}-\d{2}$/.test(str);
}

function isHHMM(str) {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(str);
}

function respondOK(res, data) {
  return res.json({ ok: true, data });
}

function respondError(res, msg, code = 400) {
  return res.status(code).json({ ok: false, msg });
}

module.exports = { isISODate, isHHMM, respondOK, respondError };
