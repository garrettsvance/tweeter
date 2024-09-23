import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

interface OAuthProps {
    displayInfoMessageWithDarkBackground: (message: string) => void;
}

const OAuth: React.FC<OAuthProps> = ({ displayInfoMessageWithDarkBackground }) => {
    const oauthProviders = [
        { name: "Google", icon: ["fab", "google"], message: "Google registration is not implemented." },
        { name: "Facebook", icon: ["fab", "facebook"], message: "Facebook registration is not implemented." },
        { name: "Twitter", icon: ["fab", "twitter"], message: "Twitter registration is not implemented." },
        { name: "LinkedIn", icon: ["fab", "linkedin"], message: "LinkedIn registration is not implemented." },
        { name: "GitHub", icon: ["fab", "github"], message: "Github registration is not implemented." }
    ];

    return (
        <div className="text-center mb-3">
            {oauthProviders.map((provider, index) => (
                <button
                    key={index}
                    type="button"
                    className="btn btn-link btn-floating mx-1"
                    onClick={() => displayInfoMessageWithDarkBackground(provider.message)}
                >
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id={`${provider.name.toLowerCase()}Tooltip`}>{provider.name}</Tooltip>}
                    >
                        <FontAwesomeIcon icon={provider.icon as any} />
                    </OverlayTrigger>
                </button>
            ))}
        </div>
    );
};

export default OAuth;
