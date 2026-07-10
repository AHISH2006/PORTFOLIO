import React from 'react';
import { 
  FaReact, FaPython, FaHtml5, FaCss3Alt, FaNodeJs, 
  FaGitAlt, FaGithub, FaFigma, FaDatabase 
} from 'react-icons/fa';
import { 
  SiTypescript, SiJavascript, SiExpress, SiMongodb, 
  SiExpo, SiFramer, SiVercel 
} from 'react-icons/si';
import { VscVscode } from 'react-icons/vsc';

export const ReactIcon = (props) => <FaReact {...props} />;
export const TypeScriptIcon = (props) => <SiTypescript {...props} />;
export const TypeScriptRealIcon = (props) => <SiTypescript {...props} />;
export const NodeIcon = (props) => <FaNodeJs {...props} />;
export const ExpressIcon = (props) => <SiExpress {...props} />;
export const MongoIcon = (props) => <SiMongodb {...props} />;
export const MongoRealIcon = (props) => <SiMongodb {...props} />;
export const PythonIcon = (props) => <FaPython {...props} />;
export const GitIcon = (props) => <FaGitAlt {...props} />;
export const JavaScriptIcon = (props) => <SiJavascript {...props} />;
export const SQLIcon = (props) => <FaDatabase {...props} />;
export const HtmlIcon = (props) => <FaHtml5 {...props} />;
export const CssIcon = (props) => <FaCss3Alt {...props} />;
export const VsCodeIcon = (props) => <VscVscode {...props} />;
export const GitHubIcon = (props) => <FaGithub {...props} />;
export const FigmaIcon = (props) => <FaFigma {...props} />;
export const VercelIcon = (props) => <SiVercel {...props} />;
export const ExpoIcon = (props) => <SiExpo {...props} />;
export const FramerMotionIcon = (props) => <SiFramer {...props} />;

// A generic default icon for fallbacks
export const GenericCodeIcon = (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>;
