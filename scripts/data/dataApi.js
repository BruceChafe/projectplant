class DataAPI {
    constructor() {
        this.dataArray = null;
    }

    async _initialize() {
        if (this.dataArray == null) {
            this.dataArray = new Promise((resolve, reject) => {
                fetch('/scripts/data/data.gz').then((response) => {
                    if (!response.ok) {
                        return reject(new Error('Could not load data.gz'));
                    }

                    const ds = new DecompressionStream('gzip');
                    new Response(response.body.pipeThrough(ds)).json()
                        .then((data) => resolve(data)).catch((e) => reject(e));
                }).catch((e) => reject(e))
            }).then((data) => {
                data.forEach((d) => {
                    if (d.cycle === 'Perennial.') {
                        d.cycle = 'Perennial';
                    }

                    if (d.sunlight?.length) {
                        d.sunlight = d.sunlight.map((s) => s.toLowerCase());
                    }

                    const terms = [];

                    if (d.common_name) {
                        terms.push(d.common_name.toLowerCase());
                    }

                    if (d.other_name?.length) {
                        d.other_name?.forEach((n) => terms.push(n.toLowerCase()));
                    }

                    if (d.scientific_name?.length) {
                        d.scientific_name?.forEach((n) => terms.push(n.toLowerCase()));
                    }

                    d.terms = [...terms.reduce((acc, t) => {
                        for (const _t of t.split(' ')) {
                            acc.add(_t);
                        }

                        return acc;
                    }, new Set())].join(' ');
                });

                return data;
            });
        }

        return this.dataArray;
    }

    async getData({
        cycle = null,       // "Annual", "Herbaceous Perennial", or "Perennial"
        watering = null,    // "Frequent", "Average", or "Minimum"
        sunlight = null,    // "full sun", 'part shade', 'filtered shade', or 'part sun/part shade',
        keyword = 'fir',     // Any keyword, will search common name, other names, and scientific names
        page = 1,
        pageSize = 30
    } = {}) {
        let dataArray = await this._initialize();

        if (watering) {
            watering = watering.toLowerCase();
            dataArray = dataArray.filter((d) => d.watering != null && d.watering.toLowerCase() === watering);
        }

        if (cycle) {
            cycle = cycle.toLowerCase();
            dataArray = dataArray.filter((d) => d.cycle != null && d.cycle.toLowerCase() === cycle);
        }

        if (sunlight) {
            sunlight = sunlight.toLowerCase();
            dataArray = dataArray.filter((d) => d.sunlight?.includes(sunlight));
        }

        if (keyword != null) {
            const regex = new RegExp(`.*${keyword}.*`);
            dataArray = dataArray.filter((d) => regex.test(d.terms));
        }

        const total = dataArray.length;

        const skip = (page - 1) * pageSize;
        dataArray = dataArray.slice(skip, skip + pageSize);

        return {
            per_page: pageSize,
            current_page: page,
            from: skip + 1,
            to: skip + dataArray.length,
            last_page: page + Math.floor((total - skip - 1) / pageSize),
            total
        }
    }
}
