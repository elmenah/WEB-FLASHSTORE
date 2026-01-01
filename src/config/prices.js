export const VBUCK_TO_CLP_RATE = 4;

export const convertVBuckToCLP = (vbucks) => {
  return vbucks * VBUCK_TO_CLP_RATE;
};

export const convertCLPToVBuck = (clp) => {
  return Math.round(clp / VBUCK_TO_CLP_RATE);
};

export const formatCLP = (amount) => {
  return amount.toLocaleString("es-CL");
};

export const formatPriceCLP = (vbucks) => {
  const clp = convertVBuckToCLP(vbucks);
  return `$${formatCLP(clp)} CLP`;
};