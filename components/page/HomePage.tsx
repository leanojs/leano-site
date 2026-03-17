"use client";

import {
  CheckCircle2,
  Download,
  RotateCcw,
  Settings2,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { FolderDropzone } from "@/components/FolderDropzone";
import { ProgressBar } from "@/components/ProgressBar";
import { FileResultsTable } from "@/components/FileResultsTable";
import Logo from "@/components/ui/logo";
import { useWebpocalypse } from "@/hooks/useWebpocalypse";

export function HomePage() {
  const {
    files,
    settings,
    progress,
    statsDisplay,
    fileResults,
    downloadUrl,
    isProcessing,
    canConvert,
    handleFilesChange,
    handleQualityChange,
    handleFormatChange,
    handleLosslessChange,
    handleConvert,
    handleDownload,
    handleAgain,
  } = useWebpocalypse();

  const showIdleState = progress.status === "idle";
  const showCompletedState = progress.status === "complete";

  return (
    <main className="relative bg-background min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none"
        style={{ backgroundImage: `url(/images/background.jpg)` }}
        aria-hidden="true"
      />

      <div className="absolute inset-0 bg-linear-to-b from-transparent to-background/50" />

      <div className="z-10 relative flex flex-col min-h-screen">
        <header className="flex justify-between items-center px-6 py-4">
          <Logo
            src="/images/webpocalypse-secondary.svg"
            alt="Webpocalypse"
            width={24}
            height={24}
            title="Webpocalypse"
          />
        </header>

        <div className="flex flex-1 items-center px-4 sm:px-6 py-6">
          <div className="flex lg:flex-row flex-col justify-start items-center gap-4 w-full">
            <div className="relative flex flex-col items-center w-full max-w-sm shrink-0">
              {downloadUrl && showCompletedState && (
                <button
                  type="button"
                  onClick={handleAgain}
                  className="inline-flex -top-8 z-0 absolute justify-center items-center gap-2 bg-card/90 hover:bg-card shadow-md backdrop-blur-md mx-auto px-4 py-3 border border-border/70 rounded-2xl rounded-b-none min-w-xs font-semibold text-foreground text-xs transition cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  Again?
                </button>
              )}

              <div className="z-10 relative bg-card/95 shadow-xl backdrop-blur-md p-3 sm:p-4 border border-border/70 rounded-4xl">
                <div className="space-y-3">
                  {showIdleState ? (
                    <>
                      <Card className="bg-card/70 shadow-none border border-border/80 border-dashed">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <span className="inline-flex justify-center items-center bg-primary/15 rounded-full w-7 h-7">
                              <Zap className="w-4 h-4 text-primary" />
                            </span>
                            Add your images
                          </CardTitle>
                          <CardDescription>
                            Drop a folder of JPG / PNG assets or click to
                            browse. Folder structure is preserved.
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <FolderDropzone
                            files={files}
                            onFilesChange={handleFilesChange}
                            disabled={isProcessing}
                            className="h-52"
                          />
                        </CardContent>
                      </Card>

                      <Card className="gap-0 bg-card/80 shadow-none border border-border/70 border-dashed">
                        <CardHeader className="px-4 py-0 pb-2">
                          <CardTitle className="flex items-center gap-2 text-sm">
                            <Settings2 className="w-4 h-4" />
                            Conversion Settings
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 px-4 pt-0">
                          <div className="flex justify-between items-center">
                            <Label
                              htmlFor="quality"
                              className={`text-xs transition-opacity ${settings.lossless ? "opacity-40" : ""}`}
                            >
                              Quality
                            </Label>
                            <span
                              className={`font-medium tabular-nums text-xs transition-opacity ${settings.lossless ? "opacity-40" : ""}`}
                            >
                              {settings.quality}%
                            </span>
                          </div>
                          <Slider
                            id="quality"
                            min={50}
                            max={100}
                            step={1}
                            value={[settings.quality]}
                            onValueChange={([value]) =>
                              handleQualityChange(value)
                            }
                            disabled={isProcessing || settings.lossless}
                            className={`w-full transition-opacity ${settings.lossless ? "opacity-40 pointer-events-none" : ""}`}
                          />
                          {settings.lossless ? (
                            <p className="text-[11px] text-amber-500/80">
                              Lossless mode ignores quality settings.
                            </p>
                          ) : (
                            <p className="text-[11px] text-muted-foreground">
                              Higher = larger files. 80% recommended.
                            </p>
                          )}
                          <div className="flex justify-between items-center pt-1">
                            <Label
                              htmlFor="lossless"
                              className="text-xs cursor-pointer"
                            >
                              Lossless Mode
                            </Label>
                            <Switch
                              id="lossless"
                              checked={settings.lossless}
                              onCheckedChange={handleLosslessChange}
                              disabled={isProcessing}
                            />
                          </div>
                          <div className="space-y-1 mt-3">
                            <p className="font-medium text-[11px] text-muted-foreground">
                              Output format
                            </p>
                            <div className="flex gap-1">
                              {[
                                { value: "webp", label: "WebP" },
                                { value: "avif", label: "AVIF" },
                                { value: "both", label: "Both" },
                              ].map((option) => (
                                <Button
                                  key={option.value}
                                  type="button"
                                  size="sm"
                                  variant={
                                    settings.outputFormat === option.value
                                      ? "default"
                                      : "outline"
                                  }
                                  disabled={isProcessing}
                                  className="px-2 h-7 text-[11px]"
                                  onClick={() =>
                                    handleFormatChange(
                                      option.value as typeof settings.outputFormat,
                                    )
                                  }
                                >
                                  {option.label}
                                </Button>
                              ))}
                            </div>
                            <p className="text-[10px] text-muted-foreground">
                              AVIF often compresses smaller than WebP; use Both
                              for maximum browser coverage.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  ) : (
                    <Card className="bg-card/80 shadow-none border border-border/70">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <span className="inline-flex justify-center items-center bg-primary/15 rounded-full w-7 h-7">
                            {showCompletedState ? (
                              <CheckCircle2 className="w-4 h-4 text-primary" />
                            ) : (
                              <Spinner className="w-4 h-4 text-primary" />
                            )}
                          </span>
                          {showCompletedState
                            ? "Conversion complete"
                            : "Processing your folder"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <ProgressBar progress={progress} />
                      </CardContent>
                    </Card>
                  )}

                  {statsDisplay && showCompletedState && (
                    <Card className="bg-primary/5 shadow-none border border-primary/30">
                      <CardContent className="pt-4">
                        <div className="gap-3 grid grid-cols-2">
                          <div className="min-w-0 text-center">
                            <p
                              className="font-bold tabular-nums text-lg sm:text-xl truncate leading-tight whitespace-nowrap"
                              title={statsDisplay.totalFiles}
                            >
                              {statsDisplay.totalFiles}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              Images Converted
                            </p>
                          </div>
                          <div className="min-w-0 text-center">
                            <p
                              className="font-bold tabular-nums text-lg sm:text-xl truncate leading-tight whitespace-nowrap"
                              title={statsDisplay.totalOriginalSize}
                            >
                              {statsDisplay.totalOriginalSize}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              Original Size
                            </p>
                          </div>
                          <div className="min-w-0 text-center">
                            <p
                              className="font-bold tabular-nums text-lg sm:text-xl truncate leading-tight whitespace-nowrap"
                              title={statsDisplay.totalConvertedSize}
                            >
                              {statsDisplay.totalConvertedSize}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              New Size
                            </p>
                          </div>
                          <div className="min-w-0 text-center">
                            <p
                              className="font-bold tabular-nums text-primary text-lg sm:text-xl truncate leading-tight whitespace-nowrap"
                              title={statsDisplay.savedPercentage}
                            >
                              {statsDisplay.savedPercentage}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              Space Saved
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-2">
                    <p className="max-w-[220px] text-[11px] text-muted-foreground">
                      Tip: Run Webpocalypse before deploying for faster sites.
                    </p>
                    {downloadUrl && showCompletedState ? (
                      <Button
                        size="lg"
                        onClick={handleDownload}
                        className="gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground whitespace-nowrap"
                      >
                        <Download className="w-4 h-4" />
                        Download ZIP
                      </Button>
                    ) : (
                      <Button
                        size="lg"
                        onClick={handleConvert}
                        disabled={!canConvert}
                        className="gap-2"
                      >
                        {isProcessing ? (
                          <>
                            <Spinner className="w-4 h-4" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4" />
                            {settings.outputFormat === "webp" &&
                              "Convert to WebP"}
                            {settings.outputFormat === "avif" &&
                              "Convert to AVIF"}
                            {settings.outputFormat === "both" &&
                              "Convert to WebP + AVIF"}
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {fileResults && showCompletedState && (
              <FileResultsTable results={fileResults} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
