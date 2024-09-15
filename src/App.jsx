import "./App.scss"
import {
    QueryClient,
    QueryClientProvider,
    useQuery,
} from '@tanstack/react-query'
import {useEffect, useMemo} from "react";
import * as PropTypes from "prop-types";

function WeatherItem({item}) {
    return <div className={"mid-container-elements"}>
        <h4>{new Date(item.dt_txt).toLocaleDateString("sv-SE", {weekday: "long"})}</h4>
        <div className={"mid-container-deg-logo"}>
            <h4 className={"degress"}>{Math.round(item.main.temp)}C</h4>
            <img src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`} alt=""/>
        </div>
    </div>;
}

WeatherItem.propTypes = {};

function App() {
    const {isPending, error, data} = useQuery({
        queryKey: ['Weather'],
        queryFn: () =>
            fetch('https://api.openweathermap.org/data/2.5/forecast?q=Stockholm&appid=593ab6d971b9ee60b1c282cf71be909d&units=metric').then((res) =>
                res.json(),
            ),
    })

    const days = useMemo(() => {
        if (!data?.list) return []
        const list = data?.list;
        const dates = Array.from(new Set(list.map(x => new Date(x.dt_txt).toDateString())));
        dates.shift()

        return dates.map(d => {
            const items = list.filter(l => new Date(l.dt_txt).toDateString() === d);
            return items[0]
        })

    }, [data])

    return (
        <div className={"container"}>
            <div className={"top-container"}>
                <img
                    src="https://s7g10.scene7.com/is/image/stena/20190603_stockholm-old-town:16-9?ts=1688734216615&dpr=off"
                    alt=""/>
                <div className={"top-container-elements"}>
                    <h4 className={"city"}>{data?.city.name}, {data?.city.country}</h4>
                    <div>
                        <h1 className={"degress"}>{Math.round(data?.list[0].main.temp)}C</h1>
                        <h4>{data?.list[0].weather[0].description}</h4>
                    </div>
                </div>
            </div>
            <div className={"mid-container"}>
                <div>
                    {days.map((item, index) => (
                        <WeatherItem key={index} item={item}/>
                    ))}
                </div>
            </div>
            <div className={"bottom-container"}>
                &copy; Made by Skibidi Frend {new Date().getFullYear()}&reg;
            </div>
        </div>
    )
}

export default App;