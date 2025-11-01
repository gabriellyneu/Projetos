import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { html } from "./view";
import { DensityRequest, DensityResponse } from "./model";
import * as turf from "@turf/turf";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Calcula área usando turf (coordenadas em [lon, lat])
function calcularArea(coordinates: [number, number][]): number {
    if (coordinates.length < 3) return 0;
    const geo = turf.polygon([[...coordinates, coordinates[0]]]);
    return turf.area(geo); // m²
}

// Calcula densidade de pessoas por m²
function calcularDensidade(area_m2: number, people: number): number {
    if (area_m2 > 0) {
        const density_p_m2 = people / area_m2;
        return density_p_m2;
    } else {
        return 0;
    }

}

app.get("/", (req, res) => res.send(html));

app.post("/density", (req, res) => {
    try {
        const body = req.body as DensityRequest;
        if (!body || typeof body.people !== "number" || !Array.isArray(body.coordinates)) {
            return res.status(400).json({ error: "Envie { people, coordinates }" });
        }

        const area_m2 = calcularArea(body.coordinates);
        const density_p_m2 = calcularDensidade(area_m2, body.people);

        const result: DensityResponse = {
            people: body.people,
            area_m2,
            density_p_m2,
            coordinates: body.coordinates
        };

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro interno" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Servidor rodando em http://localhost:${PORT}`));
