import { useEffect, useRef } from "react"
import * as echarts from "echarts";

type Props = {
    option: echarts.EChartsOption | null;
    ref: React.RefObject<echarts.ECharts | null>;
    style?: React.CSSProperties;
}
const Chart = ({ option, ref, style }: Props) => {

    const internalRef = useRef(null)

    useEffect(() => {
        if (!internalRef.current) return;
        if (!ref.current) {
            ref.current = echarts.init(internalRef.current, undefined, { renderer: "canvas" });
            const onResize = () => ref.current?.resize();
            window.addEventListener("resize", onResize);


            // Cleanup on unmount
            return () => {
                window.removeEventListener("resize", onResize);
                ref.current?.dispose();
                ref.current = null;
            };
        }
    }, []);

    useEffect(() => {

        if (ref.current && option) {
            ref.current.setOption(option);
        }
    }, [option]);

    return (
        <div ref={internalRef} style={{ width: '100%', height: '400px', ...style }} />
    )
}

export default Chart
