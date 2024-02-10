import { ButtonHTMLAttributes, Component, HTMLAttributes } from 'react';
import { ColorToRgba, ctcMethod, gcsMethod } from '../utils';

import './Button.css';
import { Slash } from 'react-feather';

type sizes    = 'sm' | 'md' | 'lg' | undefined;
type variants = 'ghost' | 'border' | 'shadow' | undefined;
type colors   = 'black' | 'white' | 'google-material-themed' | undefined;

interface ButtonProps extends ButtonHTMLAttributes<HTMLDivElement> {
    disabled          ?: boolean

    size              ?: sizes
    rounded           ?: sizes

    color             ?: colors
    variant           ?: variants

    shadow            ?: boolean | undefined

    transitionDuration?: string | undefined
}

const dummy_button_props: ButtonProps = {
    size              : 'md',
    rounded           : 'md',
    color             : 'black',
    variant           : 'shadow',
    shadow            : false,
    transitionDuration: ''
}

export class Button extends Component<ButtonProps> {
    state = {
        isHovered: false,
    }

    constructor(props: ButtonProps) {
        super(props);
    }
    
    render() {
        const buttonSizeGCS = gcsMethod('size', this.props);
        const buttonSize    = {
            x: (buttonSizeGCS as [ 0, 0 ])[0],
            y: (buttonSizeGCS as [ 0, 0 ])[1]
        };

        const buttonRoundedGCS = gcsMethod('rounded', this.props);
        const buttonRounded    = buttonRoundedGCS as number;

        const buttonAnimationTransition : string   = this.props['transitionDuration'] || 'all 196ms ease';
        const pickedColorAttribute      : string[] = (gcsMethod('color', this.props) as string[]);
        const pickedVariantAttribute    : string   = gcsMethod('variant', this.props) as string;
        
        let   pickedShadowColorPreAttrib: string   = '#cffafe2a';
        switch(pickedVariantAttribute)
        {
            case 'ghost':
            case 'border':
            {
                pickedShadowColorPreAttrib = 'transparent';
                break;
            }

            case 'shadow':
            default:
            {
                pickedShadowColorPreAttrib = '#cffafe2a';
                break;
            }
        }

        const convertedColorToSupportGhostVariant = ColorToRgba(pickedColorAttribute[1], 0.6);
        const buttonStylingVariant      : React.CSSProperties = pickedVariantAttribute == 'ghost' ? {
            backgroundColor: convertedColorToSupportGhostVariant,
            color          : pickedColorAttribute[0],
        } : pickedVariantAttribute == 'border' ? {
            border         : `2px solid ${pickedColorAttribute[1]}`,
            backgroundColor: 'transparent',
            color          : pickedColorAttribute[0],
        } : {
            border         : `none`,
            backgroundColor: pickedColorAttribute[0],
            color          : pickedColorAttribute[1],
        };
        const defaultButtonStyling      : React.CSSProperties = {
            transition  : `${buttonAnimationTransition}`,
            padding     : `${buttonSize.y * 4}px ${buttonSize.x * 4}px`,
            borderRadius: `${buttonRounded}px`,

            cursor       : this.props.disabled ? 'not-allowed' : 'pointer',
            opacity      : this.props.disabled ? 0.5 : 1,
            pointerEvents: this.props.disabled ? 'none' : 'all',

            ...buttonStylingVariant,            
        }
        
        const hoveredButtonStyling : React.CSSProperties = {
            ...defaultButtonStyling,
            
            backgroundColor: pickedColorAttribute[1],
            color          : pickedColorAttribute[0],
            
            boxShadow   : '0 6px 8px 0 ' + pickedShadowColorPreAttrib,
        }

        const props: {
            className: string,
        } = Object.entries(this.props)
        .filter(([key]) => !(key in dummy_button_props))
        .reduce((acc, [key, value]) => {
            (acc as { [key: string]: string | number | undefined })[key] = value;
            return acc;
        }, {}) as {
            className: string,
        };

        const n_ClassName: string = ctcMethod(`nui-ui font-medium inline-flex justify-center items-center nui-ui-btn-effx`
        , props.className);
        
        return (
            <div
                {...props}

                className={n_ClassName}

                onMouseDown={(event) => {
                    if ( this.props.disabled ) return;
                    this.props.onMouseDown ? this.props.onMouseDown(event) : '';

                    const t = event.target as typeof event.currentTarget;
                    t.style.opacity = `0.7`;
                }}
                onTransitionEnd={(event) => {
                    this.props.onTransitionEnd ? this.props.onTransitionEnd(event) : '';
                
                    const t = event.target as typeof event.currentTarget;
                    t.style.opacity = `1`;
                }}

                onMouseEnter={(e) => { this.props.onMouseEnter ? this.props.onMouseEnter(e) : ''; this.setState({ isHovered: true  }) }}
                onMouseLeave={(e) => { this.props.onMouseLeave ? this.props.onMouseLeave(e) : ''; this.setState({ isHovered: false }) }}
                
                style={this.state.isHovered ? hoveredButtonStyling : defaultButtonStyling}
            >
                {this.props.children}
                { this.props.disabled && <Slash className='self-center justify-self-end ml-2' width={`${buttonSize.x * 2}px`} height={`${buttonSize.x * 2}px`}/> }
            </div>
        );
    }
}
