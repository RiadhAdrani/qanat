export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
  OPTIONS: 'OPTIONS',
  HEAD: 'HEAD',
  CONNECT: 'CONNECT',
  TRACE: 'TRACE',
} as const;

export const STATUS_CODE = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,

  OK: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInfo: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  IMUsed: 226,

  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,

  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  ContentTooLarge: 413,
  URITooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  Teapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,

  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HTTPVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511,
} as const;

export type StatusCode = (typeof STATUS_CODE)[keyof typeof STATUS_CODE];

export const STATUS_TEXT = {
  [STATUS_CODE.Accepted]: 'Accepted',
  [STATUS_CODE.AlreadyReported]: 'Already Reported',
  [STATUS_CODE.BadGateway]: 'Bad Gateway',
  [STATUS_CODE.BadRequest]: 'Bad Request',
  [STATUS_CODE.Conflict]: 'Conflict',
  [STATUS_CODE.Continue]: 'Continue',
  [STATUS_CODE.Created]: 'Created',
  [STATUS_CODE.EarlyHints]: 'Early Hints',
  [STATUS_CODE.ExpectationFailed]: 'Expectation Failed',
  [STATUS_CODE.FailedDependency]: 'Failed Dependency',
  [STATUS_CODE.Forbidden]: 'Forbidden',
  [STATUS_CODE.Found]: 'Found',
  [STATUS_CODE.GatewayTimeout]: 'Gateway Timeout',
  [STATUS_CODE.Gone]: 'Gone',
  [STATUS_CODE.HTTPVersionNotSupported]: 'HTTP Version Not Supported',
  [STATUS_CODE.IMUsed]: 'IM Used',
  [STATUS_CODE.InsufficientStorage]: 'Insufficient Storage',
  [STATUS_CODE.InternalServerError]: 'Internal Server Error',
  [STATUS_CODE.LengthRequired]: 'Length Required',
  [STATUS_CODE.Locked]: 'Locked',
  [STATUS_CODE.LoopDetected]: 'Loop Detected',
  [STATUS_CODE.MethodNotAllowed]: 'Method Not Allowed',
  [STATUS_CODE.MisdirectedRequest]: 'Misdirected Request',
  [STATUS_CODE.MovedPermanently]: 'Moved Permanently',
  [STATUS_CODE.MultiStatus]: 'Multi Status',
  [STATUS_CODE.MultipleChoices]: 'Multiple Choices',
  [STATUS_CODE.NetworkAuthenticationRequired]: 'Network Authentication Required',
  [STATUS_CODE.NoContent]: 'No Content',
  [STATUS_CODE.NonAuthoritativeInfo]: 'Non Authoritative Info',
  [STATUS_CODE.NotAcceptable]: 'Not Acceptable',
  [STATUS_CODE.NotExtended]: 'Not Extended',
  [STATUS_CODE.NotFound]: 'Not Found',
  [STATUS_CODE.NotImplemented]: 'Not Implemented',
  [STATUS_CODE.NotModified]: 'Not Modified',
  [STATUS_CODE.OK]: 'OK',
  [STATUS_CODE.PartialContent]: 'Partial Content',
  [STATUS_CODE.PaymentRequired]: 'Payment Required',
  [STATUS_CODE.PermanentRedirect]: 'Permanent Redirect',
  [STATUS_CODE.PreconditionFailed]: 'Precondition Failed',
  [STATUS_CODE.PreconditionRequired]: 'Precondition Required',
  [STATUS_CODE.Processing]: 'Processing',
  [STATUS_CODE.ProxyAuthRequired]: 'Proxy Auth Required',
  [STATUS_CODE.ContentTooLarge]: 'Content Too Large',
  [STATUS_CODE.RequestHeaderFieldsTooLarge]: 'Request Header Fields Too Large',
  [STATUS_CODE.RequestTimeout]: 'Request Timeout',
  [STATUS_CODE.URITooLong]: 'URI Too Long',
  [STATUS_CODE.RangeNotSatisfiable]: 'Range Not Satisfiable',
  [STATUS_CODE.ResetContent]: 'Reset Content',
  [STATUS_CODE.SeeOther]: 'See Other',
  [STATUS_CODE.ServiceUnavailable]: 'Service Unavailable',
  [STATUS_CODE.SwitchingProtocols]: 'Switching Protocols',
  [STATUS_CODE.Teapot]: "I'm a teapot",
  [STATUS_CODE.TemporaryRedirect]: 'Temporary Redirect',
  [STATUS_CODE.TooEarly]: 'Too Early',
  [STATUS_CODE.TooManyRequests]: 'Too Many Requests',
  [STATUS_CODE.Unauthorized]: 'Unauthorized',
  [STATUS_CODE.UnavailableForLegalReasons]: 'Unavailable For Legal Reasons',
  [STATUS_CODE.UnprocessableEntity]: 'Unprocessable Entity',
  [STATUS_CODE.UnsupportedMediaType]: 'Unsupported Media Type',
  [STATUS_CODE.UpgradeRequired]: 'Upgrade Required',
  [STATUS_CODE.UseProxy]: 'Use Proxy',
  [STATUS_CODE.VariantAlsoNegotiates]: 'Variant Also Negotiates',
} as const;

export type StatusText = (typeof STATUS_TEXT)[keyof typeof STATUS_TEXT];

export type InformationalStatus =
  | typeof STATUS_CODE.Continue
  | typeof STATUS_CODE.SwitchingProtocols
  | typeof STATUS_CODE.Processing
  | typeof STATUS_CODE.EarlyHints;

export type SuccessfulStatus =
  | typeof STATUS_CODE.OK
  | typeof STATUS_CODE.Created
  | typeof STATUS_CODE.Accepted
  | typeof STATUS_CODE.NonAuthoritativeInfo
  | typeof STATUS_CODE.NoContent
  | typeof STATUS_CODE.ResetContent
  | typeof STATUS_CODE.PartialContent
  | typeof STATUS_CODE.MultiStatus
  | typeof STATUS_CODE.AlreadyReported
  | typeof STATUS_CODE.IMUsed;

export type RedirectStatus =
  | typeof STATUS_CODE.MultipleChoices // 300
  | typeof STATUS_CODE.MovedPermanently // 301
  | typeof STATUS_CODE.Found // 302
  | typeof STATUS_CODE.SeeOther // 303
  | typeof STATUS_CODE.UseProxy // 305 - DEPRECATED
  | typeof STATUS_CODE.TemporaryRedirect // 307
  | typeof STATUS_CODE.PermanentRedirect; // 308

export type ClientErrorStatus =
  | typeof STATUS_CODE.BadRequest
  | typeof STATUS_CODE.Unauthorized
  | typeof STATUS_CODE.PaymentRequired
  | typeof STATUS_CODE.Forbidden
  | typeof STATUS_CODE.NotFound
  | typeof STATUS_CODE.MethodNotAllowed
  | typeof STATUS_CODE.NotAcceptable
  | typeof STATUS_CODE.ProxyAuthRequired
  | typeof STATUS_CODE.RequestTimeout
  | typeof STATUS_CODE.Conflict
  | typeof STATUS_CODE.Gone
  | typeof STATUS_CODE.LengthRequired
  | typeof STATUS_CODE.PreconditionFailed
  | typeof STATUS_CODE.ContentTooLarge
  | typeof STATUS_CODE.URITooLong
  | typeof STATUS_CODE.UnsupportedMediaType
  | typeof STATUS_CODE.RangeNotSatisfiable
  | typeof STATUS_CODE.ExpectationFailed
  | typeof STATUS_CODE.Teapot
  | typeof STATUS_CODE.MisdirectedRequest
  | typeof STATUS_CODE.UnprocessableEntity
  | typeof STATUS_CODE.Locked
  | typeof STATUS_CODE.FailedDependency
  | typeof STATUS_CODE.UpgradeRequired
  | typeof STATUS_CODE.PreconditionRequired
  | typeof STATUS_CODE.TooManyRequests
  | typeof STATUS_CODE.RequestHeaderFieldsTooLarge
  | typeof STATUS_CODE.UnavailableForLegalReasons;

export type ServerErrorStatus =
  | typeof STATUS_CODE.InternalServerError
  | typeof STATUS_CODE.NotImplemented
  | typeof STATUS_CODE.BadGateway
  | typeof STATUS_CODE.ServiceUnavailable
  | typeof STATUS_CODE.GatewayTimeout
  | typeof STATUS_CODE.HTTPVersionNotSupported
  | typeof STATUS_CODE.VariantAlsoNegotiates
  | typeof STATUS_CODE.InsufficientStorage
  | typeof STATUS_CODE.LoopDetected
  | typeof STATUS_CODE.NotExtended
  | typeof STATUS_CODE.NetworkAuthenticationRequired;
