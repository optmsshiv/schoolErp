<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit17c5cd194213c887dc9a36fbfa4f767a
{
    public static $prefixLengthsPsr4 = array (
        'E' => 
        array (
            'Endroid\\QrCode\\' => 15,
        ),
        'D' => 
        array (
            'DASPRiD\\Enum\\' => 13,
        ),
        'B' => 
        array (
            'BaconQrCode\\' => 12,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'Endroid\\QrCode\\' => 
        array (
            0 => __DIR__ . '/..' . '/endroid/qr-code/src',
        ),
        'DASPRiD\\Enum\\' => 
        array (
            0 => __DIR__ . '/..' . '/dasprid/enum/src',
        ),
        'BaconQrCode\\' => 
        array (
            0 => __DIR__ . '/..' . '/bacon/bacon-qr-code/src',
        ),
    );

    public static $classMap = array (
        'BaconQrCode\\Common\\BitArray' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Common/BitArray.php',
        'BaconQrCode\\Common\\BitMatrix' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Common/BitMatrix.php',
        'BaconQrCode\\Common\\BitUtils' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Common/BitUtils.php',
        'BaconQrCode\\Common\\CharacterSetEci' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Common/CharacterSetEci.php',
        'BaconQrCode\\Common\\EcBlock' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Common/EcBlock.php',
        'BaconQrCode\\Common\\EcBlocks' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Common/EcBlocks.php',
        'BaconQrCode\\Common\\ErrorCorrectionLevel' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Common/ErrorCorrectionLevel.php',
        'BaconQrCode\\Common\\FormatInformation' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Common/FormatInformation.php',
        'BaconQrCode\\Common\\Mode' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Common/Mode.php',
        'BaconQrCode\\Common\\ReedSolomonCodec' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Common/ReedSolomonCodec.php',
        'BaconQrCode\\Common\\Version' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Common/Version.php',
        'BaconQrCode\\Encoder\\BlockPair' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Encoder/BlockPair.php',
        'BaconQrCode\\Encoder\\ByteMatrix' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Encoder/ByteMatrix.php',
        'BaconQrCode\\Encoder\\Encoder' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Encoder/Encoder.php',
        'BaconQrCode\\Encoder\\MaskUtil' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Encoder/MaskUtil.php',
        'BaconQrCode\\Encoder\\MatrixUtil' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Encoder/MatrixUtil.php',
        'BaconQrCode\\Encoder\\QrCode' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Encoder/QrCode.php',
        'BaconQrCode\\Exception\\ExceptionInterface' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Exception/ExceptionInterface.php',
        'BaconQrCode\\Exception\\InvalidArgumentException' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Exception/InvalidArgumentException.php',
        'BaconQrCode\\Exception\\OutOfBoundsException' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Exception/OutOfBoundsException.php',
        'BaconQrCode\\Exception\\RuntimeException' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Exception/RuntimeException.php',
        'BaconQrCode\\Exception\\UnexpectedValueException' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Exception/UnexpectedValueException.php',
        'BaconQrCode\\Exception\\WriterException' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Exception/WriterException.php',
        'BaconQrCode\\Renderer\\Color\\Alpha' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Renderer/Color/Alpha.php',
        'BaconQrCode\\Renderer\\Color\\Cmyk' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Renderer/Color/Cmyk.php',
        'BaconQrCode\\Renderer\\Color\\ColorInterface' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Renderer/Color/ColorInterface.php',
        'BaconQrCode\\Renderer\\Color\\Gray' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Renderer/Color/Gray.php',
        'BaconQrCode\\Renderer\\Color\\Rgb' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Renderer/Color/Rgb.php',
        'BaconQrCode\\Renderer\\Eye\\CompositeEye' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Renderer/Eye/CompositeEye.php',
        'BaconQrCode\\Renderer\\Eye\\EyeInterface' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Renderer/Eye/EyeInterface.php',
        'BaconQrCode\\Renderer\\Eye\\ModuleEye' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Renderer/Eye/ModuleEye.php',
        'BaconQrCode\\Renderer\\Eye\\PointyEye' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Renderer/Eye/PointyEye.php',
        'BaconQrCode\\Renderer\\Eye\\SimpleCircleEye' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Renderer/Eye/SimpleCircleEye.php',
        'BaconQrCode\\Renderer\\Eye\\SquareEye' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Renderer/Eye/SquareEye.php',
        'BaconQrCode\\Renderer\\GDLibRenderer' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Renderer/GDLibRenderer.php',
        'BaconQrCode\\Renderer\\ImageRenderer' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Renderer/ImageRenderer.php',
        'BaconQrCode\\Renderer\\Image\\EpsImageBackEnd' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Renderer/Image/EpsImageBackEnd.php',
        'BaconQrCode\\Renderer\\Image\\ImageBackEndInterface' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Renderer/Image/ImageBackEndInterface.php',
        'BaconQrCode\\Renderer\\Image\\ImagickImageBackEnd' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Renderer/Image/ImagickImageBackEnd.php',
        'BaconQrCode\\Renderer\\Image\\SvgImageBackEnd' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Renderer/Image/SvgImageBackEnd.php',
        'BaconQrCode\\Renderer\\Image\\TransformationMatrix' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Renderer/Image/TransformationMatrix.php',
        'BaconQrCode\\Renderer\\Module\\DotsModule' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Renderer/Module/DotsModule.php',
        'BaconQrCode\\Renderer\\Module\\EdgeIterator\\Edge' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Renderer/Module/EdgeIterator/Edge.php',
        'BaconQrCode\\Renderer\\Module\\EdgeIterator\\EdgeIterator' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Renderer/Module/EdgeIterator/EdgeIterator.php',
        'BaconQrCode\\Renderer\\Module\\ModuleInterface' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Renderer/Module/ModuleInterface.php',
        'BaconQrCode\\Renderer\\Module\\RoundnessModule' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Renderer/Module/RoundnessModule.php',
        'BaconQrCode\\Renderer\\Module\\SquareModule' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Renderer/Module/SquareModule.php',
        'BaconQrCode\\Renderer\\Path\\Close' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Renderer/Path/Close.php',
        'BaconQrCode\\Renderer\\Path\\Curve' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Renderer/Path/Curve.php',
        'BaconQrCode\\Renderer\\Path\\EllipticArc' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Renderer/Path/EllipticArc.php',
        'BaconQrCode\\Renderer\\Path\\Line' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Renderer/Path/Line.php',
        'BaconQrCode\\Renderer\\Path\\Move' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Renderer/Path/Move.php',
        'BaconQrCode\\Renderer\\Path\\OperationInterface' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Renderer/Path/OperationInterface.php',
        'BaconQrCode\\Renderer\\Path\\Path' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Renderer/Path/Path.php',
        'BaconQrCode\\Renderer\\PlainTextRenderer' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Renderer/PlainTextRenderer.php',
        'BaconQrCode\\Renderer\\RendererInterface' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Renderer/RendererInterface.php',
        'BaconQrCode\\Renderer\\RendererStyle\\EyeFill' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Renderer/RendererStyle/EyeFill.php',
        'BaconQrCode\\Renderer\\RendererStyle\\Fill' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Renderer/RendererStyle/Fill.php',
        'BaconQrCode\\Renderer\\RendererStyle\\Gradient' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Renderer/RendererStyle/Gradient.php',
        'BaconQrCode\\Renderer\\RendererStyle\\GradientType' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Renderer/RendererStyle/GradientType.php',
        'BaconQrCode\\Renderer\\RendererStyle\\RendererStyle' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Renderer/RendererStyle/RendererStyle.php',
        'BaconQrCode\\Writer' => __DIR__ . '/..' . '/bacon/bacon-qr-code/src/Writer.php',
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
        'DASPRiD\\Enum\\AbstractEnum' => __DIR__ . '/..' . '/dasprid/enum/src/AbstractEnum.php',
        'DASPRiD\\Enum\\EnumMap' => __DIR__ . '/..' . '/dasprid/enum/src/EnumMap.php',
        'DASPRiD\\Enum\\Exception\\CloneNotSupportedException' => __DIR__ . '/..' . '/dasprid/enum/src/Exception/CloneNotSupportedException.php',
        'DASPRiD\\Enum\\Exception\\ExceptionInterface' => __DIR__ . '/..' . '/dasprid/enum/src/Exception/ExceptionInterface.php',
        'DASPRiD\\Enum\\Exception\\ExpectationException' => __DIR__ . '/..' . '/dasprid/enum/src/Exception/ExpectationException.php',
        'DASPRiD\\Enum\\Exception\\IllegalArgumentException' => __DIR__ . '/..' . '/dasprid/enum/src/Exception/IllegalArgumentException.php',
        'DASPRiD\\Enum\\Exception\\MismatchException' => __DIR__ . '/..' . '/dasprid/enum/src/Exception/MismatchException.php',
        'DASPRiD\\Enum\\Exception\\SerializeNotSupportedException' => __DIR__ . '/..' . '/dasprid/enum/src/Exception/SerializeNotSupportedException.php',
        'DASPRiD\\Enum\\Exception\\UnserializeNotSupportedException' => __DIR__ . '/..' . '/dasprid/enum/src/Exception/UnserializeNotSupportedException.php',
        'DASPRiD\\Enum\\NullValue' => __DIR__ . '/..' . '/dasprid/enum/src/NullValue.php',
        'Endroid\\QrCode\\Bacon\\ErrorCorrectionLevelConverter' => __DIR__ . '/..' . '/endroid/qr-code/src/Bacon/ErrorCorrectionLevelConverter.php',
        'Endroid\\QrCode\\Bacon\\MatrixFactory' => __DIR__ . '/..' . '/endroid/qr-code/src/Bacon/MatrixFactory.php',
        'Endroid\\QrCode\\Builder\\Builder' => __DIR__ . '/..' . '/endroid/qr-code/src/Builder/Builder.php',
        'Endroid\\QrCode\\Builder\\BuilderInterface' => __DIR__ . '/..' . '/endroid/qr-code/src/Builder/BuilderInterface.php',
        'Endroid\\QrCode\\Builder\\BuilderRegistry' => __DIR__ . '/..' . '/endroid/qr-code/src/Builder/BuilderRegistry.php',
        'Endroid\\QrCode\\Builder\\BuilderRegistryInterface' => __DIR__ . '/..' . '/endroid/qr-code/src/Builder/BuilderRegistryInterface.php',
        'Endroid\\QrCode\\Color\\Color' => __DIR__ . '/..' . '/endroid/qr-code/src/Color/Color.php',
        'Endroid\\QrCode\\Color\\ColorInterface' => __DIR__ . '/..' . '/endroid/qr-code/src/Color/ColorInterface.php',
        'Endroid\\QrCode\\Encoding\\Encoding' => __DIR__ . '/..' . '/endroid/qr-code/src/Encoding/Encoding.php',
        'Endroid\\QrCode\\Encoding\\EncodingInterface' => __DIR__ . '/..' . '/endroid/qr-code/src/Encoding/EncodingInterface.php',
        'Endroid\\QrCode\\ErrorCorrectionLevel' => __DIR__ . '/..' . '/endroid/qr-code/src/ErrorCorrectionLevel.php',
        'Endroid\\QrCode\\Exception\\ValidationException' => __DIR__ . '/..' . '/endroid/qr-code/src/Exception/ValidationException.php',
        'Endroid\\QrCode\\ImageData\\LabelImageData' => __DIR__ . '/..' . '/endroid/qr-code/src/ImageData/LabelImageData.php',
        'Endroid\\QrCode\\ImageData\\LogoImageData' => __DIR__ . '/..' . '/endroid/qr-code/src/ImageData/LogoImageData.php',
        'Endroid\\QrCode\\Label\\Font\\Font' => __DIR__ . '/..' . '/endroid/qr-code/src/Label/Font/Font.php',
        'Endroid\\QrCode\\Label\\Font\\FontInterface' => __DIR__ . '/..' . '/endroid/qr-code/src/Label/Font/FontInterface.php',
        'Endroid\\QrCode\\Label\\Font\\OpenSans' => __DIR__ . '/..' . '/endroid/qr-code/src/Label/Font/OpenSans.php',
        'Endroid\\QrCode\\Label\\Label' => __DIR__ . '/..' . '/endroid/qr-code/src/Label/Label.php',
        'Endroid\\QrCode\\Label\\LabelAlignment' => __DIR__ . '/..' . '/endroid/qr-code/src/Label/LabelAlignment.php',
        'Endroid\\QrCode\\Label\\LabelInterface' => __DIR__ . '/..' . '/endroid/qr-code/src/Label/LabelInterface.php',
        'Endroid\\QrCode\\Label\\Margin\\Margin' => __DIR__ . '/..' . '/endroid/qr-code/src/Label/Margin/Margin.php',
        'Endroid\\QrCode\\Label\\Margin\\MarginInterface' => __DIR__ . '/..' . '/endroid/qr-code/src/Label/Margin/MarginInterface.php',
        'Endroid\\QrCode\\Logo\\Logo' => __DIR__ . '/..' . '/endroid/qr-code/src/Logo/Logo.php',
        'Endroid\\QrCode\\Logo\\LogoInterface' => __DIR__ . '/..' . '/endroid/qr-code/src/Logo/LogoInterface.php',
        'Endroid\\QrCode\\Matrix\\Matrix' => __DIR__ . '/..' . '/endroid/qr-code/src/Matrix/Matrix.php',
        'Endroid\\QrCode\\Matrix\\MatrixFactoryInterface' => __DIR__ . '/..' . '/endroid/qr-code/src/Matrix/MatrixFactoryInterface.php',
        'Endroid\\QrCode\\Matrix\\MatrixInterface' => __DIR__ . '/..' . '/endroid/qr-code/src/Matrix/MatrixInterface.php',
        'Endroid\\QrCode\\QrCode' => __DIR__ . '/..' . '/endroid/qr-code/src/QrCode.php',
        'Endroid\\QrCode\\QrCodeInterface' => __DIR__ . '/..' . '/endroid/qr-code/src/QrCodeInterface.php',
        'Endroid\\QrCode\\RoundBlockSizeMode' => __DIR__ . '/..' . '/endroid/qr-code/src/RoundBlockSizeMode.php',
        'Endroid\\QrCode\\Writer\\AbstractGdWriter' => __DIR__ . '/..' . '/endroid/qr-code/src/Writer/AbstractGdWriter.php',
        'Endroid\\QrCode\\Writer\\BinaryWriter' => __DIR__ . '/..' . '/endroid/qr-code/src/Writer/BinaryWriter.php',
        'Endroid\\QrCode\\Writer\\ConsoleWriter' => __DIR__ . '/..' . '/endroid/qr-code/src/Writer/ConsoleWriter.php',
        'Endroid\\QrCode\\Writer\\DebugWriter' => __DIR__ . '/..' . '/endroid/qr-code/src/Writer/DebugWriter.php',
        'Endroid\\QrCode\\Writer\\EpsWriter' => __DIR__ . '/..' . '/endroid/qr-code/src/Writer/EpsWriter.php',
        'Endroid\\QrCode\\Writer\\GifWriter' => __DIR__ . '/..' . '/endroid/qr-code/src/Writer/GifWriter.php',
        'Endroid\\QrCode\\Writer\\PdfWriter' => __DIR__ . '/..' . '/endroid/qr-code/src/Writer/PdfWriter.php',
        'Endroid\\QrCode\\Writer\\PngWriter' => __DIR__ . '/..' . '/endroid/qr-code/src/Writer/PngWriter.php',
        'Endroid\\QrCode\\Writer\\Result\\AbstractResult' => __DIR__ . '/..' . '/endroid/qr-code/src/Writer/Result/AbstractResult.php',
        'Endroid\\QrCode\\Writer\\Result\\BinaryResult' => __DIR__ . '/..' . '/endroid/qr-code/src/Writer/Result/BinaryResult.php',
        'Endroid\\QrCode\\Writer\\Result\\ConsoleResult' => __DIR__ . '/..' . '/endroid/qr-code/src/Writer/Result/ConsoleResult.php',
        'Endroid\\QrCode\\Writer\\Result\\DebugResult' => __DIR__ . '/..' . '/endroid/qr-code/src/Writer/Result/DebugResult.php',
        'Endroid\\QrCode\\Writer\\Result\\EpsResult' => __DIR__ . '/..' . '/endroid/qr-code/src/Writer/Result/EpsResult.php',
        'Endroid\\QrCode\\Writer\\Result\\GdResult' => __DIR__ . '/..' . '/endroid/qr-code/src/Writer/Result/GdResult.php',
        'Endroid\\QrCode\\Writer\\Result\\GifResult' => __DIR__ . '/..' . '/endroid/qr-code/src/Writer/Result/GifResult.php',
        'Endroid\\QrCode\\Writer\\Result\\PdfResult' => __DIR__ . '/..' . '/endroid/qr-code/src/Writer/Result/PdfResult.php',
        'Endroid\\QrCode\\Writer\\Result\\PngResult' => __DIR__ . '/..' . '/endroid/qr-code/src/Writer/Result/PngResult.php',
        'Endroid\\QrCode\\Writer\\Result\\ResultInterface' => __DIR__ . '/..' . '/endroid/qr-code/src/Writer/Result/ResultInterface.php',
        'Endroid\\QrCode\\Writer\\Result\\SvgResult' => __DIR__ . '/..' . '/endroid/qr-code/src/Writer/Result/SvgResult.php',
        'Endroid\\QrCode\\Writer\\Result\\WebPResult' => __DIR__ . '/..' . '/endroid/qr-code/src/Writer/Result/WebPResult.php',
        'Endroid\\QrCode\\Writer\\SvgWriter' => __DIR__ . '/..' . '/endroid/qr-code/src/Writer/SvgWriter.php',
        'Endroid\\QrCode\\Writer\\ValidatingWriterInterface' => __DIR__ . '/..' . '/endroid/qr-code/src/Writer/ValidatingWriterInterface.php',
        'Endroid\\QrCode\\Writer\\WebPWriter' => __DIR__ . '/..' . '/endroid/qr-code/src/Writer/WebPWriter.php',
        'Endroid\\QrCode\\Writer\\WriterInterface' => __DIR__ . '/..' . '/endroid/qr-code/src/Writer/WriterInterface.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInit17c5cd194213c887dc9a36fbfa4f767a::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInit17c5cd194213c887dc9a36fbfa4f767a::$prefixDirsPsr4;
            $loader->classMap = ComposerStaticInit17c5cd194213c887dc9a36fbfa4f767a::$classMap;

        }, null, ClassLoader::class);
    }
}
