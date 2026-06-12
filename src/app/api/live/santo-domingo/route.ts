import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function weatherCodeToStatus(code: number) {
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(code)) {
    return { weather: "Lluvia en SD", condition: "rainy" };
  }
  if ([1, 2, 3, 45, 48].includes(code)) {
    return { weather: "Nublado en SD", condition: "cloudy" };
  }
  return { weather: "Soleado en SD", condition: "sunny" };
}

export async function GET() {
  const time = new Intl.DateTimeFormat("es-DO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "America/Santo_Domingo",
  }).format(new Date());

  const fallback = {
    time,
    usdRate: "RD$ 59.00",
    weather: "Santo Domingo",
    temperature: "27°C",
    condition: "sunny",
    source: "fallback",
  };

  try {
    const [weatherResponse, rateResponse] = await Promise.allSettled([
      fetch("https://api.open-meteo.com/v1/forecast?latitude=18.4861&longitude=-69.9312&current=temperature_2m,weather_code&timezone=America%2FSanto_Domingo", {
        next: { revalidate: 900 },
      }),
      fetch("https://open.er-api.com/v6/latest/USD", {
        next: { revalidate: 1800 },
      }),
    ]);

    let payload = { ...fallback, source: "live" };

    if (weatherResponse.status === "fulfilled" && weatherResponse.value.ok) {
      const weatherData = await weatherResponse.value.json();
      const current = weatherData.current ?? {};
      payload = {
        ...payload,
        ...weatherCodeToStatus(Number(current.weather_code ?? 0)),
        temperature: `${Math.round(Number(current.temperature_2m ?? 27))}°C`,
      };
    }

    if (rateResponse.status === "fulfilled" && rateResponse.value.ok) {
      const rateData = await rateResponse.value.json();
      const dopRate = Number(rateData.rates?.DOP);
      if (Number.isFinite(dopRate)) {
        payload.usdRate = `RD$ ${dopRate.toFixed(2)}`;
      }
    }

    return NextResponse.json(payload);
  } catch {
    return NextResponse.json(fallback);
  }
}
