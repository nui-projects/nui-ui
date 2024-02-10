import { InputHTMLAttributes, Component, ReactNode } from 'react';
import { ColorToRgba, ctcMethod, gcsMethod } from '../utils';
import { Slash } from 'react-feather';

type sizes    = 'sm' | 'md' | 'lg' | undefined;
type variants = 'ghost' | 'border' | 'shadow' | undefined;
type colors   = 'black' | 'white' | 'google-material-themed' | undefined;

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label             ?: string
    labelSize         ?: number | undefined
    labelClassName    ?: string | undefined

    pclassName        ?: string | undefined

    disabled          ?: boolean
    rounded           ?: sizes | undefined
    bordered          ?: boolean

    color             ?: colors
    variant           ?: variants

    startContent      ?: ReactNode | undefined
    endContent        ?: ReactNode | undefined

    shadow            ?: boolean

    transitionDuration?: string | undefined
}

const dummy_button_props: InputProps = {
    label              : 'md',
    labelSize          : 0,
    startContent       : undefined,
    endContent         : undefined,
    labelClassName     : 'md',
    pclassName         : '',
    rounded            : 'md',
    color              : 'black',
    variant            : 'shadow',
    shadow             : false,
    bordered           : true,
    transitionDuration : ''
}

export class Input extends Component<InputProps> {
    sprops = Object.entries(this.props)
        .filter(([key]) => !(key in dummy_button_props))
        .reduce((acc, [key, value]) => {
            (acc as { [key: string]: string | number | undefined })[key] = value;
            return acc;
        }, {}) as {
            className: string,
        };

    constructor(props: InputProps) {
        super(props);
    }
    
    render() {
        const InputSizeGCS = gcsMethod('size', this.props);
        const InputSize    = {
            x: (InputSizeGCS as [ 0, 0 ])[0],
            y: (InputSizeGCS as [ 0, 0 ])[1]
        };

        const InputRoundedGCS = gcsMethod('rounded', this.props);
        const InputRounded    = InputRoundedGCS as number;

        const InputAnimationTransition : string   = this.props['transitionDuration'] || 'all 196ms ease';
        const pickedColorAttribute      : string[] = (gcsMethod('color', this.props) as string[]);
        const pickedVariantAttribute    : string   = gcsMethod('variant', this.props) as string;

        const convertedColorToSupportGhostVariant = ColorToRgba(pickedColorAttribute[1], 0.1);
        const InputStylingVariant      : React.CSSProperties = pickedVariantAttribute == 'ghost' ? {
            backgroundColor: convertedColorToSupportGhostVariant,
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
        // const InputStylingPadding      : React.CSSProperties = this.props.startcontent ? {
        //     paddingLeft : `${InputSize.x * 4}px`,
        // } : this.props.endContent ? {
        //     paddingRight: `${InputSize.x * 4}px`,
        // } : {
        //     padding     : `${InputSize.y * 4}px ${InputSize.x * 4}px`,
        // }

        const InputStylingPadding      : React.CSSProperties = {
            padding     : `${InputSize.y * 2}px ${InputSize.x * 4}px`,
        }

        const defaultInputStyling      : React.CSSProperties = {
            transition  : `${InputAnimationTransition}`,
            borderRadius: `${InputRounded}px`,
            outline     : 'none',

            opacity      : !this.props.disabled ? 1 : 0.5,
            pointerEvents: !this.props.disabled ? 'all' : 'none',
            
            ...InputStylingVariant,  
            ...InputStylingPadding          
        }
        
        const n_ClassName: string = ctcMethod(`nui-ui font-normal inline-flex justify-center items-center nui-ui-input-effx min-w-max min-h-12 select-none ` + this.props.pclassName
        , this.props.className);

        const MainInputComponent = ( ) => (
            <div
                className={n_ClassName}
                style={{
                    ...defaultInputStyling,
                    outline: this.props.bordered ? `2px solid ${convertedColorToSupportGhostVariant}` : '',
                }}
            >
                { this.props.startContent ? this.props.startContent : '' }
                <input {...this.sprops} 
                    className={
                        ctcMethod(`nui-ui font-normal select-all placeholder:opacity-25 placeholder:text-current outline-none bg-transparent inline-flex justify-center items-center nui-ui-input-effx min-h-10 text-base`
                        , this.props.className)
                    }
                    style={{
                        ...this.props.style,
                        minWidth: `calc(100% - ${(InputSize.x * 3) + (InputSize.x * 3)}px)`
                    }}
                />
                { this.props.endContent ? this.props.endContent : this.props.disabled ? <Slash width={`${InputSize.x * 3}px`} height={`${InputSize.x * 3}px`}/> : '' }
            </div>
        )

        return !this.props.label ? <MainInputComponent/> : (
            <div className='flex flex-col gap-2 nui-ui-input'>
                <p className={
                    ctcMethod('font-bold opacity-75', this.props.labelClassName)
                } style={{
                    fontSize  : `${this.props.labelSize || 14}px`,
                    userSelect: 'none',
                    color     : pickedColorAttribute[1],
                }}>{this.props.label}</p>
                <MainInputComponent/>
            </div>
        );
    }
}
