import { FormHTMLAttributes, Component, ReactNode } from 'react';
import { ColorToRgba, ctcMethod, gcsMethod } from '../utils';

type sizes    = 'sm' | 'md' | 'lg' | undefined;
type variants = 'ghost' | 'border' | 'shadow' | undefined;
type colors   = 'black' | 'white' | 'google-material-themed' | undefined;

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
    titleComponent     : ReactNode

    disabled          ?: boolean
    rounded           ?: sizes | undefined

    color             ?: colors
    variant           ?: variants

    shadow            ?: boolean

    transitionDuration?: string | undefined
}

const dummy_button_props: FormProps = {
    titleComponent     : '',
    rounded            : 'md',
    color              : 'black',
    variant            : 'shadow',
    shadow             : false,
    transitionDuration : ''
}

export class Form extends Component<FormProps> {
    sprops = Object.entries(this.props)
        .filter(([key]) => !(key in dummy_button_props))
        .reduce((acc, [key, value]) => {
            (acc as { [key: string]: string | number | undefined })[key] = value;
            return acc;
        }, {}) as {
            className: string,
        };

    constructor(props: FormProps) {
        super(props);
    }
    
    render() {
        const FormSizeGCS = gcsMethod('size', this.props);
        const FormSize    = {
            x: (FormSizeGCS as [ 0, 0 ])[0],
            y: (FormSizeGCS as [ 0, 0 ])[1]
        };

        const FormRoundedGCS = gcsMethod('rounded', this.props);
        const FormRounded    = FormRoundedGCS as number;

        const FormAnimationTransition : string   = this.props['transitionDuration'] || 'all 196ms ease';
        const pickedColorAttribute      : string[] = (gcsMethod('color', this.props) as string[]);
        const pickedVariantAttribute    : string   = gcsMethod('variant', this.props) as string;
        
        let   pickedShadowColorPreAttrib: string   = '#cffafe3a';
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
                pickedShadowColorPreAttrib = '#cffafe3a';
                break;
            }
        }

        const convertedColorToSupportGhostVariant = ColorToRgba(pickedColorAttribute[0], 0.08);
        const FormStylingVariant      : React.CSSProperties = pickedVariantAttribute == 'ghost' ? {
            backgroundColor: pickedColorAttribute[0],
            color          : pickedColorAttribute[1],
        } : pickedVariantAttribute == 'border' ? {
            border         : `2px solid ${pickedColorAttribute[1]}`,
            backgroundColor: 'transparent',
            color          : pickedColorAttribute[1],
        } : {
            border         : `none`,
            backgroundColor: pickedColorAttribute[0],
            color          : pickedColorAttribute[1],
        };
        // const FormStylingPadding      : React.CSSProperties = this.props.startcontent ? {
        //     paddingLeft : `${FormSize.x * 4}px`,
        // } : this.props.endContent ? {
        //     paddingRight: `${FormSize.x * 4}px`,
        // } : {
        //     padding     : `${FormSize.y * 4}px ${FormSize.x * 4}px`,
        // }

        const FormStylingPadding      : React.CSSProperties = {
            padding     : `${FormSize.y * 16}px ${FormSize.x * 8}px`,
        }

        const defaultFormStyling      : React.CSSProperties = {
            transition  : `${FormAnimationTransition}`,
            borderRadius: `${FormRounded}px`,
            outline     : 'none',

            opacity      : !this.props.disabled ? 1 : 0.5,
            pointerEvents: !this.props.disabled ? 'all' : 'none',

            ...FormStylingVariant,  
            ...FormStylingPadding          
        }
        
        const n_ClassName: string = ctcMethod(`nui-ui font-normal flex flex-col justify-center nui-ui-form-effx min-w-max min-h-max select-none`
        , this.props.className);

        return (
            <form
                { ...this.sprops }
                className={n_ClassName}
                style={defaultFormStyling}
            >
                <span className={`min-w-full pb-1 mb-3 inline-flex justify-start items-center border-b border-b-[${convertedColorToSupportGhostVariant}]`}>
                    { this.props.titleComponent }
                </span>
                { this.props.children }
            </form>
        );
    }
}
