export const KeyCodes = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  ENTER: 13
};

export const isNextKey = (key) => {
  return key === KeyCodes.RIGHT ||
    key === KeyCodes.DOWN;
};

export const isPrevKey = (key) => {
  return key === KeyCodes.LEFT ||
    key === KeyCodes.UP;
};

export const isKeyDownOnTabElement = (prefixCls, target) => {
  const tRole = target.getAttribute("role");
  const tControl = target.getAttribute("aria-controls");
  const tId = target.id;

  const matcher = new RegExp('^' + prefixCls);

  // both tests garantees that we are not in a different
  // scope.
  const t1 = tRole == "tabpanel" && matcher.test(tId);
  const t2 = tRole == "tab" && matcher.test(tControl);

  return t1 || t2;
};
