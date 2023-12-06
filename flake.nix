{
  description = "Devshell environment with bun and nodejs20";
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };
  outputs = { self, nixpkgs, flake-utils }: 
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        nodejs = pkgs.nodejs_20;
        yarn = pkgs.yarn;
        addToPath = [
          "./node_modules/.bin"
        ];
      in {
        devShells.default = pkgs.mkShell {
          packages = [
            nodejs
            yarn
          ];
          shellHook = ''
            export PATH="./node_modules/.bin:$PATH"
          '';
        };
      }
    );
}
