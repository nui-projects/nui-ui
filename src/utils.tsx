const ctcMethod = (className: string, propsClassName: string | undefined) => (className.trim() + ' ' + (propsClassName || '')).trim()
const gcsMethod = (name: string, props: Readonly<any>) => {
    switch (name)
    {
        case 'size':
            switch(props[name])
            {
                case 'sm':
                    return [4, 1];
                case 'md':
                    return [6, 2];
                case 'lg':
                    return [9, 3];

                default:
                    return [6, 2];
            }
        
        case 'rounded':
            switch(props[name])
            {
                case 'sm':
                    return 8;
                case 'md':
                    return 12;
                case 'lg':
                    return 16;

                default:
                    return 12;
            }
        
        
        case 'variant':
            switch(props[name])
            {
                case 'border':
                    return 'border';
                
                case 'ghost':
                    return 'ghost';

                case 'shadow':
                default:
                    return 'shadow';
            }
        
        case 'color':
        {
            const variants = {
                black: ['black', 'white'],
                white: ['white', 'black'],
                gmthe: ['white', '#2ca5f5']
            };
            
            switch(props[name])
            {
                case 'black':
                    return variants.black;
                case 'white':
                    return variants.white;
                case 'google-material-themed':
                    return variants.gmthe;

                default:
                    return variants.black;
            }
        }
    }
}

interface RGBA {
    r: number;
    g: number;
    b: number;
}

function ColorToRgba(color: string, alpha: number = 1.0): string {
    // Helper function to convert hex to RGBA
    function hexToRgba(hex: string): RGBA {
        hex = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => {
            return r + r + g + g + b + b;
        });

        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : {
            r: -1,
            g: -1,
            b: -1
        };
    }

    // Convert color name or hex to RGBA
    let rgba: RGBA;
    if (/^#[0-9A-F]{6}$/i.test(color) || /^#[0-9A-F]{3}$/i.test(color)) {
        rgba = hexToRgba(color);
    } else {
        // Convert named colors
        switch (color.toLowerCase()) {
            case 'black':
                rgba = { r: 70, g: 70, b: 70 };
                break;
            case 'white':
                rgba = { r: 255, g: 255, b: 255 };
                break;

            default:
                throw new Error('Unsupported color name');
        }
    }

    return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${alpha})`;
}

export {
    ctcMethod,
    gcsMethod,
    ColorToRgba
}