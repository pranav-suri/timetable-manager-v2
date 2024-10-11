import { Subdivision } from "../database";

export default async function availableSubdivisions(slotId: number, divisionId: number) {
    const subdivisions = await Subdivision.findAll({
        where: { DivisionId: divisionId },
    });
    const subdivisionIds = subdivisions.map((subdivision) => subdivision.id);
    const busySubdivisions = await Subdivision.findAll({
        include: [
            {
                association: "SlotDataSubdivisions",
                where: { SubdivisionId: subdivisionIds },
                required: true,
                attributes: [],
                include: [
                    {
                        association: "SlotData",
                        where: { SlotId: slotId },
                        required: true,
                        attributes: [],
                    },
                ],
            },
        ],
    });
    const availableSubdivisions = subdivisions.filter(
        (availableSubdivision) =>
            !busySubdivisions.some(
                (busySubdivision) => busySubdivision.id === availableSubdivision.id,
            ),
    );
    return availableSubdivisions;
}
