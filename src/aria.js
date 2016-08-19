/**
 * findAriaId - Find the index of the tab by the 'aria-controls'.
 *
 * @param  {string} aid The aria-controls attribute.
 * @return {string}
 */
export const findId = (aid) => {
  const key = /(\d+)$/g.exec(aid);
  return key;
};
