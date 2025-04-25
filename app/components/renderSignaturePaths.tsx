export const renderSignaturePaths = (signaturePaths) => {
    if (Array.isArray(signaturePaths)) {
        return signaturePaths.map((path, index) => {
            if (Array.isArray(path) && path.length > 0) {
                let pathString = `M${path[0].x},${path[0].y}`;
                for (let i = 1; i < path.length; i++) {
                    pathString += ` L${path[i].x},${path[i].y}`;
                }

                return (
                    <Path
                        key={`path-${index}`}
                        d={pathString}
                        stroke="black"
                        strokeWidth={3}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                );
            }
            return null; 
        });
    }
    return null; 
};