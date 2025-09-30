import NodeCache from "node-cache";

// arbitrary TTL and check period values
const DEFAULT_TTL_SECONDS = 60 * 3;
const CHECK_PERIOD_SECONDS = 60 * 5;

// const cache = new NodeCache({ stdTTL: 10, checkperiod: 15 });
const cache = new NodeCache({ stdTTL: DEFAULT_TTL_SECONDS, checkperiod: CHECK_PERIOD_SECONDS });

export default cache