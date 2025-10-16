export function isObject(item) {
    return item && typeof item === "object" && !Array.isArray(item) && item != null;
}

export function mergeObject(target, source) {
    if (typeof Object.assign !== "function") {
        (function () {
            Object.assign = function (target) {
                // We must check against these specific cases.
                if (target === undefined || target === null) {
                    throw new TypeError("Cannot convert undefined or null to object");
                }

                let output = Object(target);
                for (let index = 1; index < arguments.length; index++) {
                    let source = arguments[index];
                    if (source !== undefined && source !== null) {
                        for (let nextKey in source) {
                            if (source.hasOwnProperty(nextKey)) {
                                output[nextKey] = source[nextKey];
                            }
                        }
                    }
                }
                return output;
            };
        })();
    }

    let output = Object.assign({}, target);
    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach((key) => {
            if (isObject(source[key])) {
                if (!(key in target)) {
                    Object.assign(output, {
                        [key]: source[key],
                    });
                } else {
                    output[key] = mergeObject(target[key], source[key]);
                }
            } else {
                Object.assign(output, {
                    [key]: source[key],
                });
            }
        });
    }
    return output;
}
