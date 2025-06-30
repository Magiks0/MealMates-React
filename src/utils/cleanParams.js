export const buildSearchParams = (current, overrides = {}) => {
    const next = new URLSearchParams();

    const get = (k) => overrides[k] ?? current.get(k);

    const keys = [
        "keyword",
        "minPrice",
        "maxPrice",
        "address",
        "radius",
        "peremptionDate",
        "dietaries",
        "types",
    ];

    keys.forEach((k) => {
        const v = get(k);
        if (v !== undefined && v !== null && v !== "" && v !== "null") {
            next.set(k, v);
        }
    });

    return next;
};
