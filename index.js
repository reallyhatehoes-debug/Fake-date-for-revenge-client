(function () {
  const REAL_DATE = "Oct 15, 2025";
  const CUSTOM_DATE = "May 7, 2015";

  const { ReactNative } = vendetta.metro.common;
  const { after } = vendetta.patcher;

  let unpatch;

  return {
    onLoad: function () {
      unpatch = after("render", ReactNative.Text, function (_, res) {
        if (!res || !res.props || !res.props.children) return;

        if (typeof res.props.children === "string" && res.props.children.includes(REAL_DATE)) {
          res.props.children = res.props.children.replace(REAL_DATE, CUSTOM_DATE);
        }

        if (Array.isArray(res.props.children)) {
          res.props.children = res.props.children.map(function (child) {
            return typeof child === "string" && child.includes(REAL_DATE)
              ? child.replace(REAL_DATE, CUSTOM_DATE)
              : child;
          });
        }
      });
    },
    onUnload: function () {
      if (unpatch) unpatch();
    }
  };
})();
