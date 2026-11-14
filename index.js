const REAL_DATE = "Oct 15, 2025"; 

const CUSTOM_DATE = "May 7, 2015"; 

const { ReactNative } = vendetta.metro.common;
const { after } = vendetta.patcher;

let unpatch;

export default {
  onLoad: () => {
    unpatch = after("render", ReactNative.Text, (_, res) => {
      if (!res?.props?.children) return;
      if (typeof res.props.children === "string" && res.props.children.includes(REAL_DATE)) {
        res.props.children = res.props.children.replace(REAL_DATE, CUSTOM_DATE);
      }
      if (Array.isArray(res.props.children)) {
        res.props.children = res.props.children.map((child) =>
          typeof child === "string" && child.includes(REAL_DATE)
            ? child.replace(REAL_DATE, CUSTOM_DATE)
            : child
        );
      }
    });
  },
  onUnload: () => {
    if (unpatch) unpatch();
  }
};
