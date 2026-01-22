{pkgs ? import <nixpkgs> {}}:
pkgs.mkShell {
  packages = [
    pkgs.bun
    pkgs.nodejs
    pkgs.biome
    pkgs.sops
    pkgs.age
  ];
}
